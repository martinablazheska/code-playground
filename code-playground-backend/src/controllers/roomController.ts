import { Request, Response } from "express";
import { RoomService } from "../services/roomService";

const roomService = new RoomService();

export class RoomController {
  public createRoom = async (req: Request, res: Response): Promise<void> => {
    try {
      const { ownerName } = req.body;

      if (!ownerName) {
        res.status(400).json({ error: "Owner name is required" });
        return;
      }

      const { roomId, ownerId } = await roomService.createRoom(ownerName);
      res.status(201).json({ roomId, ownerId });
    } catch (error) {
      console.error("Error creating room:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
