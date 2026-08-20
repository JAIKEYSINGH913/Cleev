import { Router } from "express";
import { UserController } from "../controllers/userController";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.use(requireAuth);

router.get("/search", UserController.search);
router.get("/me", UserController.me);
router.put("/me", UserController.updateProfile);
router.put("/me/password", UserController.updatePassword);

export default router;
