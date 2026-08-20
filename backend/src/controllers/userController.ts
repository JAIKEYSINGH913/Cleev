import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService";
import { AuthRequest } from "../middlewares/auth";

export class UserController {
  static async search(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query = (req.query.q as string) || "";
      const users = await UserService.searchUsers(query, req.user!.id);
      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  static async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const profile = await UserService.getProfile(req.user!.id);
      res.json(profile);
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const profile = await UserService.updateProfile(req.user!.id, req.body);
      res.json(profile);
    } catch (err) {
      next(err);
    }
  }

  static async updatePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { newPassword } = req.body;
      const bcrypt = require("bcryptjs");
      const passwordHash = await bcrypt.hash(newPassword, 10);
      await UserService.updatePassword(req.user!.id, passwordHash);
      res.json({ message: "Password updated successfully" });
    } catch (err) {
      next(err);
    }
  }
}
