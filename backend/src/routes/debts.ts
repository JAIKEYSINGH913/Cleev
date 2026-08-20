import { Router } from "express";
import { detectCircularDebt, getDebtGraphData, optimizeGroupDebts, optimizeGlobalDebts } from "../services/settlementService";

const router = Router();

// GET /api/debts/graph
router.get("/graph", async (req, res) => {
  try {
    const graphData = await getDebtGraphData();
    res.json(graphData);
  } catch (error) {
    console.error("Error fetching graph data:", error);
    res.status(500).json({ error: "Failed to fetch graph data" });
  }
});

// GET /api/debts/circular/:userId
router.get("/circular/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const cycles = await detectCircularDebt(userId);
    res.json(cycles);
  } catch (error) {
    console.error("Error detecting circular debt:", error);
    res.status(500).json({ error: "Failed to detect circular debt" });
  }
});

import { requireAuth } from "../middlewares/auth";

// GET /api/debts/optimize (Global optimization for current user)
router.get("/optimize", requireAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const optimization = await optimizeGlobalDebts(userId);
    res.json(optimization);
  } catch (error) {
    console.error("Error optimizing global debts:", error);
    res.status(500).json({ error: "Failed to optimize global debts" });
  }
});
router.get("/optimize/:groupId", async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const optimization = await optimizeGroupDebts(groupId);
    res.json(optimization);
  } catch (error) {
    console.error("Error optimizing debts:", error);
    res.status(500).json({ error: "Failed to optimize debts" });
  }
});

export default router;
