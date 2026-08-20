import { getDriver } from "../config/database";

export class UserService {
  static async searchUsers(query: string, excludeId: string) {
    const session = getDriver().session();
    try {
      const result = await session.run(
        `
        MATCH (u:User)
        WHERE (u.username CONTAINS $query OR u.name CONTAINS $query OR u.email CONTAINS $query)
          AND u.id <> $excludeId
        RETURN u.id AS id, u.username AS username, u.name AS name, u.email AS email
        LIMIT 10
        `,
        { query, excludeId }
      );
      
      return result.records.map(r => ({
        id: r.get("id"),
        username: r.get("username"),
        name: r.get("name"),
        email: r.get("email")
      }));
    } finally {
      await session.close();
    }
  }

  static async getProfile(userId: string) {
    const session = getDriver().session();
    try {
      const result = await session.run(
        `
        MATCH (u:User {id: $userId})
        RETURN u.id AS id, u.username AS username, u.name AS name, u.email AS email, u.upiId AS upiId
        `,
        { userId }
      );
      
      if (result.records.length === 0) throw new Error("USER_NOT_FOUND");
      return {
        id: result.records[0].get("id"),
        username: result.records[0].get("username"),
        name: result.records[0].get("name"),
        email: result.records[0].get("email"),
        upiId: result.records[0].get("upiId")
      };
    } finally {
      await session.close();
    }
  }

  static async updateProfile(userId: string, data: { name?: string, username?: string, upiId?: string }) {
    const session = getDriver().session();
    try {
      const sets: string[] = [];
      const params: any = { userId };
      
      if (data.name) { sets.push("u.name = $name"); params.name = data.name; }
      if (data.username) { sets.push("u.username = $username"); params.username = data.username; }
      if (data.upiId) { sets.push("u.upiId = $upiId"); params.upiId = data.upiId; }
      
      if (sets.length === 0) return this.getProfile(userId);

      await session.run(`MATCH (u:User {id: $userId}) SET ${sets.join(", ")}`, params);
      return this.getProfile(userId);
    } finally {
      await session.close();
    }
  }

  static async updatePassword(userId: string, newPasswordHash: string) {
    const session = getDriver().session();
    try {
      await session.run(`MATCH (u:User {id: $userId}) SET u.passwordHash = $passwordHash`, { userId, passwordHash: newPasswordHash });
    } finally {
      await session.close();
    }
  }
}
