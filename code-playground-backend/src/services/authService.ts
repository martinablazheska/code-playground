import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm/expressions";
import { db } from "@/db";
import { users } from "@/db/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export class AuthService {
  async register(username: string, password: string) {
    // Validate username
    if (!this.isValidUsername(username)) {
      throw new Error(
        "Invalid username. Username must be 3-20 characters long and contain only letters, numbers, and underscores."
      );
    }

    // Validate password
    if (!this.isValidPassword(password)) {
      throw new Error(
        "Invalid password. Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await db
      .insert(users)
      .values({
        username,
        password: hashedPassword,
      })
      .returning();

    return this.generateToken(user.id);
  }

  async login(username: string, password: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    return this.generateToken(user.id);
  }

  private generateToken(userId: string) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });
  }

  getUserId(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      return decoded.userId;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  private isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }

  private isValidPassword(password: string): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }
}
