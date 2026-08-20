import { getDriver } from "../config/database";
import { v4 as uuidv4 } from "uuid";

export class GroupService {
  static async createGroup(creatorId: string, name: string, memberIds: string[]) {
    const session = getDriver().session();
    try {
      const groupId = uuidv4();
      
      // Ensure the creator is in the member list
      const uniqueMembers = Array.from(new Set([...memberIds, creatorId]));

      await session.run(
        `
        MATCH (creator:User {id: $creatorId})
        CREATE (g:Group {
          id: $groupId,
          name: $name,
          createdAt: datetime()
        })
        CREATE (creator)-[:CREATED]->(g)
        
        WITH g
        UNWIND $uniqueMembers AS memberId
        MATCH (u:User {id: memberId})
        CREATE (u)-[:MEMBER_OF]->(g)
        
        RETURN g
        `,
        { creatorId, groupId, name, uniqueMembers }
      );
      
      return this.getGroupById(groupId);
    } finally {
      await session.close();
    }
  }

  static async getGroupById(groupId: string) {
    const session = getDriver().session();
    try {
      const result = await session.run(
        `
        MATCH (g:Group {id: $groupId})
        OPTIONAL MATCH (g)<-[:CREATED]-(creator:User)
        OPTIONAL MATCH (g)<-[:MEMBER_OF]-(m:User)
        RETURN g, creator.id as creatorId, collect({id: m.id, name: m.name, username: m.username}) as members
        `,
        { groupId }
      );
      
      if (result.records.length === 0) throw new Error("Group not found");
      const record = result.records[0];
      const groupProps = record.get("g").properties;
      return {
        id: groupProps.id,
        name: groupProps.name,
        creatorId: record.get("creatorId"),
        members: record.get("members")
      };
    } finally {
      await session.close();
    }
  }

  static async getGroups(userId: string) {
    const session = getDriver().session();
    try {
      const result = await session.run(
        `
        MATCH (u:User {id: $userId})-[:MEMBER_OF]->(g:Group)
        OPTIONAL MATCH (g)<-[:CREATED]-(creator:User)
        OPTIONAL MATCH (g)<-[:MEMBER_OF]-(m:User)
        RETURN g, creator.id as creatorId, collect({id: m.id, name: m.name, username: m.username}) as members
        `,
        { userId }
      );
      
      return result.records.map(record => {
        const groupProps = record.get("g").properties;
        return {
          id: groupProps.id,
          name: groupProps.name,
          creatorId: record.get("creatorId"),
          members: record.get("members")
        };
      });
    } finally {
      await session.close();
    }
  }

  static async updateGroup(groupId: string, userId: string, name: string, memberIds: string[]) {
    const session = getDriver().session();
    const tx = session.beginTransaction();
    try {
      // 1. Verify ownership
      const authResult = await tx.run(
        `MATCH (u:User {id: $userId})-[:CREATED]->(g:Group {id: $groupId}) RETURN g`,
        { userId, groupId }
      );
      if (authResult.records.length === 0) {
        throw new Error("UNAUTHORIZED");
      }

      const uniqueMembers = Array.from(new Set([...memberIds, userId]));

      // 2. Update name and reconstruct members
      await tx.run(
        `
        MATCH (g:Group {id: $groupId})
        SET g.name = $name
        
        // Remove old members
        WITH g
        OPTIONAL MATCH (old_m:User)-[r:MEMBER_OF]->(g)
        DELETE r
        
        // Add new members
        WITH g
        UNWIND $uniqueMembers AS memberId
        MATCH (u:User {id: memberId})
        CREATE (u)-[:MEMBER_OF]->(g)
        `,
        { groupId, name, uniqueMembers }
      );
      
      await tx.commit();
      return this.getGroupById(groupId);
    } catch (err) {
      await tx.rollback();
      throw err;
    } finally {
      await session.close();
    }
  }

  static async deleteGroup(groupId: string, userId: string) {
    const session = getDriver().session();
    try {
      const result = await session.run(
        `
        MATCH (u:User {id: $userId})-[:CREATED]->(g:Group {id: $groupId})
        DETACH DELETE g
        RETURN count(g) as deleted
        `,
        { userId, groupId }
      );
      
      if (result.records[0].get("deleted").toNumber() === 0) {
        throw new Error("UNAUTHORIZED_OR_NOT_FOUND");
      }
    } finally {
      await session.close();
    }
  }
}
