import { io, Socket } from "socket.io-client";
import { Room } from "../types/types";

const SOCKET_URL = "http://localhost:3000";

export const createSocketConnection = (
  roomId: string,
  token: string,
  onRoomUpdate: (room: Room) => void
): Socket => {
  const socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    path: "/io",
  });

  socket.on("connect", () => console.log("connected ws"));
  socket.on("room:update", onRoomUpdate);
  socket.emit("join", { roomId, token });

  return socket;
};
