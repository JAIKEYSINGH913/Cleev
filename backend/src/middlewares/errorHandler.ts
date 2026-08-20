import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  
  if (err.name === "ZodError") {
    return res.status(400).json({ error: "VALIDATION_ERROR", message: err.errors });
  }

  if (err.message === "EMAIL_TAKEN") return res.status(409).json({ error: "EMAIL_TAKEN", message: "Email already in use." });
  if (err.message === "USERNAME_TAKEN") return res.status(409).json({ error: "USERNAME_TAKEN", message: "Username already in use." });
  if (err.message === "OTP_EXPIRED") return res.status(400).json({ error: "OTP_EXPIRED", message: "OTP expired. Please request a new one." });
  if (err.message === "INVALID_OTP") return res.status(400).json({ error: "INVALID_OTP", message: "Invalid OTP code." });
  if (err.message === "INVALID_CREDENTIALS") return res.status(401).json({ error: "INVALID_CREDENTIALS", message: "Invalid email or password." });
  if (err.message === "EMAIL_NOT_VERIFIED") return res.status(403).json({ error: "EMAIL_NOT_VERIFIED", message: "Please verify your email before logging in." });

  res.status(500).json({ error: "SERVER_ERROR", message: "Something went wrong." });
};
