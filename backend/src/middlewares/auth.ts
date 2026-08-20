import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthRequest extends Request {
  user?: { id: string };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "UNAUTHORIZED", message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "UNAUTHORIZED", message: "Invalid or expired token" });
  }
};
