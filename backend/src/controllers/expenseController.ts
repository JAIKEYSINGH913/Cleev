import { Request, Response, NextFunction } from "express";
import { ExpenseService } from "../services/expenseService";
import { AuthRequest } from "../middlewares/auth";

export class ExpenseController {
  static async addExpense(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const payerId = req.user!.id;
      const { participants, description, totalAmount, category, groupId } = req.body;
      
      const expense = await ExpenseService.createExpense(payerId, participants, description, totalAmount, category, groupId);
      res.status(201).json(expense);
    } catch (err) {
      next(err);
    }
  }

  static async getFeed(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const feed = await ExpenseService.getFeed(userId);
      res.json(feed);
    } catch (err) {
      next(err);
    }
  }

  static async updateExpense(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { description, totalAmount, category } = req.body;
      const expense = await ExpenseService.updateExpense(req.params.id, req.user!.id, description, totalAmount, category);
      res.json(expense);
    } catch (err: any) {
      if (err.message === "UNAUTHORIZED_OR_NOT_FOUND") {
        res.status(403).json({ error: "Only the creator can modify this expense" });
        return;
      }
      next(err);
    }
  }

  static async deleteExpense(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await ExpenseService.deleteExpense(req.params.id, req.user!.id);
      res.json({ success: true, message: "Expense deleted successfully" });
    } catch (err: any) {
      if (err.message === "UNAUTHORIZED_OR_NOT_FOUND") {
        res.status(403).json({ error: "Only the creator can delete this expense" });
        return;
      }
      next(err);
    }
  }
}
