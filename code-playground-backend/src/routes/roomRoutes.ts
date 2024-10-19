import express from "express";
import { RoomController } from "../controllers/roomController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();
const roomController = new RoomController();

router.post("/create", authenticate, roomController.createRoom);
router.post("/join", authenticate, roomController.joinRoom);
router.get("/:id", roomController.getRoom);

export default router;
