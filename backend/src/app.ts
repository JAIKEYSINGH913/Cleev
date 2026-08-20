import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { initDB } from "./config/database";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/authRoutes";
import debtRoutes from "./routes/debts";

const app = express();
const PORT = env.PORT;

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Initialize Graph DB
(async () => {
  await initDB();
})();

// Basic health check
app.get("/", (req, res) => {
  res.send("Welcome to the Cleev Backend API! Go to /health to check status.");
});

app.post("/test-direct", (req, res) => {
  res.json({ ok: true });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "Cleev API", db: "CognoDB" });
});

import expenseRoutes from "./routes/expenseRoutes";
import userRoutes from "./routes/userRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import groupRoutes from "./routes/groupRoutes";

// Import routers
app.use("/api/auth", authRoutes);
app.use("/api/debts", debtRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/groups", groupRoutes);

// Error handling middleware
app.use(errorHandler);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

export default app;
