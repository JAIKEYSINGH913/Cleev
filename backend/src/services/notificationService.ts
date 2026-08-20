import { getDriver } from "../config/database";
import { v4 as uuidv4 } from "uuid";

export class NotificationService {
  static async createNotification(userId: string, message: string, type: string, link?: string) {
    const session = getDriver().session();
    try {
      const id = uuidv4();
      const createdAt = new Date().toISOString();
      await session.run(
        `
        MATCH (u:User {id: $userId})
        CREATE (n:Notification {
          id: $id,
          message: $message,
          type: $type,
          link: $link,
          isRead: false,
          createdAt: $createdAt
        })
        CREATE (u)-[:HAS_NOTIFICATION]->(n)
        RETURN n
        `,
        { userId, id, message, type, link: link || "", createdAt }
      );
    } finally {
      await session.close();
    }
  }

  static async getNotifications(userId: string) {
    const session = getDriver().session();
    try {
      const result = await session.run(
        `
        MATCH (u:User {id: $userId})-[:HAS_NOTIFICATION]->(n:Notification)
        RETURN n
        ORDER BY n.createdAt DESC
        LIMIT 20
        `,
        { userId }
      );
      
      return result.records.map(r => r.get("n").properties);
    } finally {
      await session.close();
    }
  }

  static async markAsRead(userId: string, notificationId: string) {
    const session = getDriver().session();
    try {
      await session.run(
        `
        MATCH (u:User {id: $userId})-[:HAS_NOTIFICATION]->(n:Notification {id: $notificationId})
        SET n.isRead = true
        RETURN n
        `,
        { userId, notificationId }
      );
    } finally {
      await session.close();
    }
  }

  static async markAllAsRead(userId: string) {
    const session = getDriver().session();
    try {
      await session.run(
        `
        MATCH (u:User {id: $userId})-[:HAS_NOTIFICATION]->(n:Notification)
        WHERE n.isRead = false
        SET n.isRead = true
        `,
        { userId }
      );
    } finally {
      await session.close();
    }
  }
}
