import express, { Request, Response } from "express";
import { RoomController } from "../controllers/roomController";

const router = express.Router();
const roomController = new RoomController();

router.post("/create", (req: Request, res: Response) =>
  roomController.createRoom(req, res)
);
router.post("/join", (req, res) => roomController.joinRoom(req, res));

export default router;
