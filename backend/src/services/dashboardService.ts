import { getDriver } from "../config/database";

export class DashboardService {
  static async getDashboardData(userId: string) {
    const session = getDriver().session();
    try {
      // 1. Get Financial Overview (You owe, You are owed)
      const balanceResult = await session.run(
        `
        CALL {
          MATCH (u:User {id: $userId})-[r:OWES]->(other:User)
          WHERE r.status = 'PENDING'
          RETURN sum(r.amount) as youOwe
        }
        CALL {
          MATCH (other:User)-[r:OWES]->(u:User {id: $userId})
          WHERE r.status = 'PENDING'
          RETURN sum(r.amount) as youAreOwed
        }
        RETURN youOwe, youAreOwed
        `,
        { userId }
      );
      
      const youOwe = balanceResult.records[0]?.get("youOwe")?.toNumber() || 0;
      const youAreOwed = balanceResult.records[0]?.get("youAreOwed")?.toNumber() || 0;
      const netBalance = youAreOwed - youOwe;

      // 2. Get Recent Activity (from Notifications or Expenses)
      // We'll use notifications for recent activity as they capture events well
      const activityResult = await session.run(
        `
        MATCH (u:User {id: $userId})-[:HAS_NOTIFICATION]->(n:Notification)
        RETURN n.id as id, n.message as desc, n.type as type, n.createdAt as time
        ORDER BY n.createdAt DESC
        LIMIT 5
        `,
        { userId }
      );
      
      const recentActivity = activityResult.records.map(r => ({
        id: r.get("id"),
        desc: r.get("desc"),
        type: r.get("type"), // e.g. 'owe', 'paid', 'settle'
        time: r.get("time"),
        // Mocking amount/group for now since notification might not have them natively in standard fields
        amount: "View", 
        group: "Cleev"
      }));

      // 3. Get Active Groups
      // For now we'll fetch groups the user is in. 
      const groupsResult = await session.run(
        `
        MATCH (u:User {id: $userId})-[:MEMBER_OF]->(g:Group)
        OPTIONAL MATCH (g)<-[:MEMBER_OF]-(m:User)
        RETURN g.id as id, g.name as name, count(DISTINCT m) as members
        LIMIT 4
        `,
        { userId }
      );
      
      const activeGroups = groupsResult.records.map(r => ({
        id: r.get("id"),
        name: r.get("name"),
        members: r.get("members").toNumber(),
        balance: 0, // Would calculate actual group balance here
        status: "Settled"
      }));

      return {
        financials: {
          netBalance,
          youOwe,
          youAreOwed
        },
        recentActivity,
        activeGroups
      };
    } finally {
      await session.close();
    }
  }
}
