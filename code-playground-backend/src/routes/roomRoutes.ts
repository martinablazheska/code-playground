import express from "express";
import { RoomController } from "@/controllers/roomController";
import { authenticate } from "@/middleware/authMiddleware";

const router = express.Router();
const roomController = new RoomController();

router.get("/:id", roomController.getRoom);
router.post("/create", authenticate, roomController.createRoom);
router.post("/join", authenticate, roomController.joinRoom);

export default router;
