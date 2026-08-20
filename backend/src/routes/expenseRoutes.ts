import { Router } from "express";
import { ExpenseController } from "../controllers/expenseController";
import { requireAuth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { z } from "zod";

const router = Router();

const addExpenseSchema = z.object({
  description: z.string().min(1),
  totalAmount: z.number().positive(),
  category: z.string(),
  groupId: z.string().uuid().optional(),
  participants: z.array(z.object({
    userId: z.string().uuid(),
    amount: z.number().positive()
  })).min(1)
});

router.use(requireAuth);

router.post("/", validate(addExpenseSchema), ExpenseController.addExpense);
router.get("/feed", ExpenseController.getFeed);
router.put("/:id", ExpenseController.updateExpense);
router.delete("/:id", ExpenseController.deleteExpense);

export default router;
