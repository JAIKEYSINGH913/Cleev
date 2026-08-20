import { getDriver } from "../config/database";
import { redis } from "../config/redis";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { sendOTP } from "./emailService";

export class AuthService {
  static async checkUniqueness(email: string, username: string) {
    const session = getDriver().session();
    try {
      const result = await session.run(
        `MATCH (u:User) WHERE u.email = $email OR u.username = $username RETURN u.email AS email, u.username AS username`,
        { email, username }
      );
      if (result.records.length > 0) {
        const record = result.records[0];
        if (record.get("email") === email) throw new Error("EMAIL_TAKEN");
        if (record.get("username") === username) throw new Error("USERNAME_TAKEN");
      }
    } finally {
      await session.close();
    }
  }

  static async signup(data: any) {
    await this.checkUniqueness(data.email, data.username);

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const userId = uuidv4();

    const session = getDriver().session();
    try {
      await session.run(
        `CREATE (u:User {
          id: $id, email: $email, username: $username, name: $name, 
          passwordHash: $passwordHash, isActive: true, emailVerified: false,
          createdAt: datetime()
        }) RETURN u`,
        { ...data, id: userId, passwordHash: hashedPassword }
      );

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await redis.set(`otp:${data.email}`, otp, "EX", 300); // 5 mins
      await sendOTP(data.email, otp);

      return { id: userId, email: data.email };
    } finally {
      await session.close();
    }
  }

  static async verifyOTP(email: string, otp: string) {
    const storedOtp = await redis.get(`otp:${email}`);
    if (!storedOtp) throw new Error("OTP_EXPIRED");
    if (storedOtp !== otp) throw new Error("INVALID_OTP");

    const session = getDriver().session();
    try {
      const result = await session.run(
        `MATCH (u:User {email: $email}) SET u.emailVerified = true RETURN u`,
        { email }
      );

      if (result.records.length === 0) throw new Error("USER_NOT_FOUND");
      const user = result.records[0].get("u").properties;
      await redis.del(`otp:${email}`);

      return this.generateTokens(user.id);
    } finally {
      await session.close();
    }
  }

  static async login(identifier: string, password: string) {
    const session = getDriver().session();
    try {
      const result = await session.run(
        `MATCH (u:User) WHERE u.email = $identifier OR u.username = $identifier RETURN u`,
        { identifier }
      );
      if (result.records.length === 0) throw new Error("INVALID_CREDENTIALS");

      const user = result.records[0].get("u").properties;
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) throw new Error("INVALID_CREDENTIALS");
      // if (!user.emailVerified) throw new Error("EMAIL_NOT_VERIFIED");

      return this.generateTokens(user.id);
    } finally {
      await session.close();
    }
  }

  static generateTokens(userId: string) {
    const accessToken = jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
    return { accessToken, refreshToken };
  }

  static async forgotPassword(email: string) {
    const session = getDriver().session();
    try {
      const result = await session.run(`MATCH (u:User {email: $email}) RETURN u`, { email });
      if (result.records.length === 0) throw new Error("USER_NOT_FOUND");
      
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await redis.set(`otp:reset:${email}`, otp, "EX", 900); // 15 mins expiry
      await sendEmail(email, "Password Reset OTP", `Your OTP for password reset is ${otp}. It expires in 15 minutes.`);
    } finally {
      await session.close();
    }
  }

  static async resetPassword(email: string, otp: string, newPassword: string) {
    const storedOtp = await redis.get(`otp:reset:${email}`);
    if (!storedOtp || storedOtp !== otp) throw new Error("INVALID_OTP");

    const session = getDriver().session();
    try {
      const passwordHash = await bcrypt.hash(newPassword, 10);
      const result = await session.run(
        `MATCH (u:User {email: $email}) SET u.passwordHash = $passwordHash RETURN u`,
        { email, passwordHash }
      );
      if (result.records.length === 0) throw new Error("USER_NOT_FOUND");
      await redis.del(`otp:reset:${email}`);
    } finally {
      await session.close();
    }
  }
}
