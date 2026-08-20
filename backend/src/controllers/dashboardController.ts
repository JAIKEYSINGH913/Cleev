import { Response, NextFunction } from "express";
import { DashboardService } from "../services/dashboardService";
import { AuthRequest } from "../middlewares/auth";

export class DashboardController {
  static async getDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await DashboardService.getDashboardData(req.user!.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
}
