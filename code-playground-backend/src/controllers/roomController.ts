import { Request, Response } from "express";
import { RoomService } from "../services/roomService";

const roomService = new RoomService();

export class RoomController {
  public createRoom = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.userId; // Assuming you set this in your auth middleware
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const room = await roomService.createRoom(userId);
      res.status(201).json(room);
    } catch (error) {
      console.error("Error creating room:", error);
      res.status(500).json({ error: "Failed to create room" });
    }
  };

  public joinRoom = async (req: Request, res: Response): Promise<void> => {
    try {
      const { roomId } = req.body;
      const userId = req.userId; // Assuming you set this in your auth middleware
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const room = await roomService.joinRoom(roomId, userId);
      res.status(200).json(room);
    } catch (error) {
      console.error("Error joining room:", error);
      res.status(500).json({ error: "Failed to join room" });
    }
  };

  public leaveRoom = async (req: Request, res: Response): Promise<void> => {
    try {
      const { roomId } = req.params;
      const userId = req.userId; // Assuming you set this in your auth middleware
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const room = await roomService.leaveRoom(roomId, userId);
      res.status(200).json(room);
    } catch (error) {
      console.error("Error leaving room:", error);
      res.status(500).json({ error: "Failed to leave room" });
    }
  };

  public getRoom = async (req: Request, res: Response): Promise<void> => {
    try {
      const roomId = req.params.id;
      const room = await roomService.getRoom(roomId);
      res.status(200).json(room);
    } catch (error) {
      console.error("Error fetching room:", error);
      res.status(404).json({ error: "Room not found" });
    }
  };
}
