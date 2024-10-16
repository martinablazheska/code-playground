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

      const room = await roomService.createRoom(ownerName);
      res.status(201).json(room);
    } catch (error) {
      console.error("Error creating room:", error);
      res.status(500).json({ error: "Failed to create room" });
    }
  };

  public joinRoom = async (req: Request, res: Response): Promise<void> => {
    try {
      const { roomId, userName } = req.body;

      if (!roomId || !userName) {
        res.status(400).json({ error: "Room ID and user name are required" });
        return;
      }

      const room = await roomService.joinRoom(roomId, userName);
      res.status(200).json(room);
    } catch (error) {
      console.error("Error joining room:", error);
      res.status(500).json({ error: "Failed to join room" });
    }
  };
}
