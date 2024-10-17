import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { setupSocketHandlers } from "./socket/socketHandlers";
import roomRoutes from "./routes/roomRoutes";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/rooms", roomRoutes);

//Socket handlers
setupSocketHandlers(io);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
