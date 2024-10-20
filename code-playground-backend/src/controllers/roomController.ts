import { Request, Response } from "express";
import { RoomService } from "../services/roomService";
import {
  ProgrammingLanguage,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
} from "../constants/programmingLanguages";

const roomService = new RoomService();

export class RoomController {
  public createRoom = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { name, programmingLanguage, privacyType } = req.body;

      if (!name || typeof name !== "string") {
        res
          .status(400)
          .json({ error: "Room name is required and must be a string" });
        return;
      }

      let language: ProgrammingLanguage = DEFAULT_LANGUAGE;
      if (programmingLanguage) {
        if (!SUPPORTED_LANGUAGES.includes(programmingLanguage)) {
          res.status(400).json({ error: "Unsupported programming language" });
          return;
        }
        language = programmingLanguage as ProgrammingLanguage;
      }

      let privacy: "private" | "invite-only" | "public" = "public";
      if (
        privacyType &&
        ["private", "invite-only", "public"].includes(privacyType)
      ) {
        privacy = privacyType as "private" | "invite-only" | "public";
      }

      const room = await roomService.createRoom(
        userId,
        name,
        language,
        privacy
      );
      res.status(201).json(room);
    } catch (error) {
      console.error("Error creating room:", error);
      res.status(500).json({ error: "Failed to create room" });
    }
  };

  public joinRoom = async (req: Request, res: Response): Promise<void> => {
    try {
      const { roomId } = req.body;
      const userId = req.userId;

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
      const userId = req.userId;
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
