import { Response, NextFunction } from "express";
import { GroupService } from "../services/groupService";
import { AuthRequest } from "../middlewares/auth";

export class GroupController {
  static async createGroup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, memberIds } = req.body;
      const group = await GroupService.createGroup(req.user!.id, name, memberIds || []);
      res.status(201).json(group);
    } catch (err) {
      next(err);
    }
  }

  static async getGroups(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const groups = await GroupService.getGroups(req.user!.id);
      res.json(groups);
    } catch (err) {
      next(err);
    }
  }

  static async getGroup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const group = await GroupService.getGroupById(req.params.id);
      res.json(group);
    } catch (err) {
      next(err);
    }
  }

  static async updateGroup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, memberIds } = req.body;
      const group = await GroupService.updateGroup(req.params.id, req.user!.id, name, memberIds || []);
      res.json(group);
    } catch (err: any) {
      if (err.message === "UNAUTHORIZED") {
        res.status(403).json({ error: "Only the creator can modify this group" });
        return;
      }
      next(err);
    }
  }

  static async deleteGroup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await GroupService.deleteGroup(req.params.id, req.user!.id);
      res.json({ success: true, message: "Group deleted successfully" });
    } catch (err: any) {
      if (err.message === "UNAUTHORIZED_OR_NOT_FOUND") {
        res.status(403).json({ error: "Only the creator can delete this group or it doesn't exist" });
        return;
      }
      next(err);
    }
  }
}
