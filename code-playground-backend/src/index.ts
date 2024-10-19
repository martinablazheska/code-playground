import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server as SocketIOServer } from "socket.io";
import roomRoutes from "./routes/roomRoutes";
import authRoutes from "./routes/authRoutes";
import { RoomService } from "./services/roomService";
import { setupSocketHandlers } from "./socket/socketHandlers";

const roomService = new RoomService();

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/rooms", roomRoutes);
app.use("/api/auth", authRoutes);

setupSocketHandlers(io);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
