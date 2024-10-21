import { Request, Response, NextFunction } from "express";
import { AuthService } from "@/services/authService";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const authService = new AuthService();

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const userId = authService.getUserId(token);
    req.userId = userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
