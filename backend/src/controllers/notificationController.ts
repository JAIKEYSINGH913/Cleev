import { Response, NextFunction } from "express";
import { NotificationService } from "../services/notificationService";
import { AuthRequest } from "../middlewares/auth";

export class NotificationController {
  static async getNotifications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const notifications = await NotificationService.getNotifications(req.user!.id);
      res.json(notifications);
    } catch (err) {
      next(err);
    }
  }

  static async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await NotificationService.markAsRead(req.user!.id, id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }

  static async markAllAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await NotificationService.markAllAsRead(req.user!.id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
}
