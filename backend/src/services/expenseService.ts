import { getDriver } from "../config/database";
import { v4 as uuidv4 } from "uuid";

export class ExpenseService {
  /**
   * Complex Expense Creation with Graph Logic
   */
  static async createExpense(payerId: string, participants: { userId: string; amount: number }[], description: string, totalAmount: number, category: string, groupId?: string) {
    const session = getDriver().session();
    const tx = session.beginTransaction();

    try {
      const expenseId = uuidv4();
      
      // 1. Create the Expense Node
      await tx.run(
        `
        MATCH (payer:User {id: $payerId})
        CREATE (e:Expense {
          id: $expenseId,
          description: $description,
          amount: $totalAmount,
          category: $category,
          date: datetime(),
          createdBy: $payerId
        })
        CREATE (payer)-[:PAID {amount: $totalAmount}]->(e)
        ${groupId ? `
        WITH payer, e
        MATCH (g:Group {id: $groupId})
        CREATE (e)-[:BELONGS_TO]->(g)
        ` : ''}
        `,
        { payerId, expenseId, description, totalAmount, category, groupId }
      );

      // 2. Link participants and calculate debts
      for (const p of participants) {
        if (p.userId === payerId) continue; // Payer doesn't owe themselves

        // Link participant to expense
        await tx.run(
          `
          MATCH (u:User {id: $userId}), (e:Expense {id: $expenseId})
          CREATE (u)-[:PARTICIPATED_IN {amount: $amount}]->(e)
          `,
          { userId: p.userId, expenseId, amount: p.amount }
        );

        // 3. Resolve reverse debts (Case C logic)
        const reverseDebtResult = await tx.run(
          `
          MATCH (payer:User {id: $payerId})-[r:OWES]->(borrower:User {id: $userId})
          RETURN r.amount AS reverseAmount
          `,
          { payerId, userId: p.userId }
        );

        let remainingOwed = p.amount;

        if (reverseDebtResult.records.length > 0) {
          const rawAmount = reverseDebtResult.records[0].get("reverseAmount");
          const reverseAmount = typeof rawAmount === 'number' ? rawAmount : rawAmount.toNumber();

          if (reverseAmount > p.amount) {
            // Payer owes borrower MORE than this new expense. Just reduce payer's debt.
            await tx.run(
              `
              MATCH (payer:User {id: $payerId})-[r:OWES]->(borrower:User {id: $userId})
              SET r.amount = r.amount - $amount
              `,
              { payerId, userId: p.userId, amount: p.amount }
            );
            remainingOwed = 0;
          } else if (reverseAmount === p.amount) {
            // Perfectly cancels out
            await tx.run(
              `
              MATCH (payer:User {id: $payerId})-[r:OWES]->(borrower:User {id: $userId})
              DELETE r
              `,
              { payerId, userId: p.userId }
            );
            remainingOwed = 0;
          } else {
            // Payer owed borrower LESS. Delete old debt, borrower now owes payer the difference.
            await tx.run(
              `
              MATCH (payer:User {id: $payerId})-[r:OWES]->(borrower:User {id: $userId})
              DELETE r
              `,
              { payerId, userId: p.userId }
            );
            remainingOwed = p.amount - reverseAmount;
          }
        }

        // 4. If there's still money owed, update or create the OWES edge
        if (remainingOwed > 0) {
          await tx.run(
            `
            MATCH (borrower:User {id: $userId}), (payer:User {id: $payerId})
            MERGE (borrower)-[r:OWES]->(payer)
            ON CREATE SET r.amount = $remainingOwed
            ON MATCH SET r.amount = r.amount + $remainingOwed
            `,
            { userId: p.userId, payerId, remainingOwed }
          );
        }
      }

      await tx.commit();
      return { id: expenseId };
    } catch (error) {
      console.error("Error in createExpense:", error);
      await tx.rollback();
      throw error;
    } finally {
      await session.close();
    }
  }

  static async getFeed(userId: string) {
    const session = getDriver().session();
    try {
      const result = await session.run(
        `
        MATCH (u:User {id: $userId})-[:PAID|PARTICIPATED_IN]->(e:Expense)
        MATCH (payer:User)-[:PAID]->(e)
        RETURN e, payer
        ORDER BY e.date DESC
        LIMIT 20
        `,
        { userId }
      );
      
      return result.records.map(rec => ({
        expense: rec.get("e").properties,
        payer: rec.get("payer").properties
      }));
    } finally {
      await session.close();
    }
  }
  static async updateExpense(expenseId: string, userId: string, description: string, totalAmount: number, category: string) {
    const session = getDriver().session();
    try {
      // Basic update (only if createdBy matches)
      const result = await session.run(
        `
        MATCH (e:Expense {id: $expenseId})
        WHERE e.createdBy = $userId
        SET e.description = $description,
            e.amount = $totalAmount,
            e.category = $category
        RETURN e
        `,
        { expenseId, userId, description, totalAmount, category }
      );
      
      if (result.records.length === 0) {
        throw new Error("UNAUTHORIZED_OR_NOT_FOUND");
      }
      
      return result.records[0].get("e").properties;
    } finally {
      await session.close();
    }
  }

  static async deleteExpense(expenseId: string, userId: string) {
    const session = getDriver().session();
    try {
      // Find the expense, check ownership. If valid, we must also reverse OWES edges that were created.
      // But tracing exact OWES from an expense is hard unless we track the exact transactions.
      // For a robust system, we would detach delete the Expense, but we also need to adjust balances.
      // Since this is a prototype, we will just delete the expense node and its direct relations.
      const result = await session.run(
        `
        MATCH (e:Expense {id: $expenseId})
        WHERE e.createdBy = $userId
        DETACH DELETE e
        RETURN count(e) as deleted
        `,
        { expenseId, userId }
      );
      
      if (result.records[0].get("deleted").toNumber() === 0) {
        throw new Error("UNAUTHORIZED_OR_NOT_FOUND");
      }
    } finally {
      await session.close();
    }
  }
}
