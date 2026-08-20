import { getDriver } from "../config/database";

export const detectCircularDebt = async (userId: string) => {
  const session = getDriver().session();
  try {
    const result = await session.run(
      `
      MATCH (a:User { id: $userId })-[r1:OWES]->(b:User)-[r2:OWES]->(c:User)-[r3:OWES]->(a)
      WHERE r1.status = 'PENDING'
        AND r2.status = 'PENDING'
        AND r3.status = 'PENDING'
        AND a <> c
      RETURN
        a.name AS userA, b.name AS userB, c.name AS userC,
        r1.amount AS a_owes_b,
        r2.amount AS b_owes_c,
        r3.amount AS c_owes_a,
        min(r1.amount, min(r2.amount, r3.amount)) AS netSettlement
      LIMIT 5
      `,
      { userId }
    );

    const cycles = result.records.map(record => ({
      userA: record.get("userA"),
      userB: record.get("userB"),
      userC: record.get("userC"),
      a_owes_b: record.get("a_owes_b").toNumber(),
      b_owes_c: record.get("b_owes_c").toNumber(),
      c_owes_a: record.get("c_owes_a").toNumber(),
      netSettlement: record.get("netSettlement").toNumber(),
    }));

    return cycles;
  } finally {
    await session.close();
  }
};

export const getDebtGraphData = async () => {
  const session = getDriver().session();
  try {
    const result = await session.run(
      `
      MATCH (u1:User)-[r:OWES {status: 'PENDING'}]->(u2:User)
      RETURN u1.id AS sourceId, u1.name AS sourceName, 
             u2.id AS targetId, u2.name AS targetName, 
             r.amount AS amount
      `
    );

    const nodesMap = new Map();
    const edges: any[] = [];

    result.records.forEach(record => {
      const sourceId = record.get("sourceId");
      const targetId = record.get("targetId");
      
      if (!nodesMap.has(sourceId)) {
        nodesMap.set(sourceId, { data: { id: sourceId, label: record.get("sourceName") } });
      }
      if (!nodesMap.has(targetId)) {
        nodesMap.set(targetId, { data: { id: targetId, label: record.get("targetName") } });
      }

      edges.push({
        data: {
          id: `${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
          amount: `₹${record.get("amount").toNumber()}`,
          rawAmount: record.get("amount").toNumber()
        }
      });
    });

    return {
      nodes: Array.from(nodesMap.values()),
      edges
    };
  } finally {
    await session.close();
  }
};

export const optimizeGroupDebts = async (groupId: string) => {
  const session = getDriver().session();
  try {
    // 1. Get raw edges for the group (we know debts exist between members, but wait: do we store group-specific debts or global debts? In Cleev, debts are global per user pair, but if we want to optimize a *group's* debts, we need to sum expenses within that group? The user's architecture said "Group Settlement... Greedy Match... resolves all within a group". If the debts are global, we just optimize global debts of the members of that group.)
    // Wait, the plan says: "Job 4 — Settle Up & Optimize ... Greedy Match Settlement Optimization: 1. Fetch all balances for users in a group."
    
    // Let's get the net balances of all users in the specified group for expenses belonging to this group!
    // Since we modeled `(e:Expense)-[:BELONGS_TO]->(g:Group)` and `(u)-[:PAID]->(e)` and `(u)-[:PARTICIPATED_IN]->(e)`, we can calculate EXACT group balances dynamically, bypassing global global OWES edges.
    
    const balanceResult = await session.run(
      `
      MATCH (u:User)-[:MEMBER_OF]->(g:Group {id: $groupId})
      OPTIONAL MATCH (u)-[paid:PAID]->(e:Expense)-[:BELONGS_TO]->(g)
      WITH u, g, COALESCE(SUM(paid.amount), 0) AS totalPaid
      OPTIONAL MATCH (u)-[part:PARTICIPATED_IN]->(e:Expense)-[:BELONGS_TO]->(g)
      WITH u, totalPaid, COALESCE(SUM(part.amount), 0) AS totalOwed
      RETURN u.id AS userId, u.name AS userName, (totalPaid - totalOwed) AS netBalance
      `,
      { groupId }
    );

    const balances = balanceResult.records.map(r => {
      const net = r.get("netBalance");
      const netBalance = typeof net === 'number' ? net : (net?.toNumber ? net.toNumber() : 0);
      return {
        userId: r.get("userId"),
        userName: r.get("userName"),
        netBalance
      };
    });

    // Generate raw transactions list (who paid what for whom... this is hard to derive exactly without breaking down every expense, but we can just use the global OWES edges filtered by group members for the "Raw" view, OR just show the list of balances. Let's return balances and let the algorithm determine the optimized edges).
    
    // Greedy Match Algorithm
    const debtors = balances.filter(b => b.netBalance < -0.01).map(b => ({ ...b, amount: Math.abs(b.netBalance) })).sort((a, b) => b.amount - a.amount);
    const creditors = balances.filter(b => b.netBalance > 0.01).map(b => ({ ...b, amount: b.netBalance })).sort((a, b) => b.amount - a.amount);

    const optimizedTransactions = [];

    let i = 0; // debtors index
    let j = 0; // creditors index

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const settleAmount = Math.min(debtor.amount, creditor.amount);

      optimizedTransactions.push({
        fromId: debtor.userId,
        fromName: debtor.userName,
        toId: creditor.userId,
        toName: creditor.userName,
        amount: Math.round(settleAmount * 100) / 100
      });
      debtor.amount -= settleAmount;
      creditor.amount -= settleAmount;

      if (debtor.amount < 0.01) i++;
      if (creditor.amount < 0.01) j++;
    }

    return {
      balances,
      optimizedTransactions
    };

  } finally {
    await session.close();
  }
};

export const optimizeGlobalDebts = async (userId: string) => {
  const session = getDriver().session();
  try {
    const balanceResult = await session.run(
      `
      MATCH (u:User {id: $userId})-[:OWES*1..3]-(connected:User)
      WITH DISTINCT connected
      OPTIONAL MATCH (connected)<-[owedTo:OWES]-()
      WITH connected, COALESCE(SUM(owedTo.amount), 0) AS totalCredit
      OPTIONAL MATCH (connected)-[owes:OWES]->()
      WITH connected, totalCredit, COALESCE(SUM(owes.amount), 0) AS totalDebt
      RETURN connected.id AS userId, connected.name AS userName, (totalCredit - totalDebt) AS netBalance
      `,
      { userId }
    );

    const balances = balanceResult.records.map(r => {
      const net = r.get("netBalance");
      const netBalance = typeof net === 'number' ? net : (net?.toNumber ? net.toNumber() : 0);
      return {
        userId: r.get("userId"),
        userName: r.get("userName"),
        netBalance
      };
    });

    const debtors = balances.filter(b => b.netBalance < -0.01).map(b => ({ ...b, amount: Math.abs(b.netBalance) })).sort((a, b) => b.amount - a.amount);
    const creditors = balances.filter(b => b.netBalance > 0.01).map(b => ({ ...b, amount: b.netBalance })).sort((a, b) => b.amount - a.amount);

    const optimizedTransactions = [];
    let i = 0; let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const settleAmount = Math.min(debtor.amount, creditor.amount);

      optimizedTransactions.push({
        fromId: debtor.userId,
        fromName: debtor.userName,
        toId: creditor.userId,
        toName: creditor.userName,
        amount: Math.round(settleAmount * 100) / 100
      });

      debtor.amount -= settleAmount;
      creditor.amount -= settleAmount;

      if (debtor.amount < 0.01) i++;
      if (creditor.amount < 0.01) j++;
    }

    return { balances, optimizedTransactions };
  } finally {
    await session.close();
  }
};

