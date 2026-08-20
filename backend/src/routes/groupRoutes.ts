import { Router } from "express";
import { GroupController } from "../controllers/groupController";
import { requireAuth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { z } from "zod";

const router = Router();

const groupSchema = z.object({
  name: z.string().min(1),
  memberIds: z.array(z.string().uuid()).optional()
});

router.use(requireAuth);

router.post("/", validate(groupSchema), GroupController.createGroup);
router.get("/", GroupController.getGroups);
router.get("/:id", GroupController.getGroup);
router.put("/:id", validate(groupSchema), GroupController.updateGroup);
router.delete("/:id", GroupController.deleteGroup);

export default router;
