import { Request, Response } from "express";
import { AuthService } from "../services/authService";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const token = await authService.register(username, password);
      res.status(201).json({ token });
    } catch (error) {
      res.status(400).json({ error: "Registration failed" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const token = await authService.login(username, password);
      res.status(200).json({ token });
    } catch (error) {
      res.status(401).json({ error: "Invalid credentials" });
    }
  }
}
