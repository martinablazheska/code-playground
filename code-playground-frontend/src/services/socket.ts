import { io, Socket } from "socket.io-client";
import { Room } from "../types/types";

const SOCKET_URL = "http://localhost:3000";

export const createSocketConnection = (
  roomId: string,
  token: string,
  onRoomUpdate: (room: Room) => void,
  onConsoleUpdate: (update: { stdout: string }) => void,
  onParticipantRemoved: (updatedRoom: Room) => void
): Socket => {
  const socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    path: "/io",
  });

  socket.on("connect", () => console.log("connected ws"));
  socket.on("room:update", onRoomUpdate);
  socket.on("participant_removed", (updatedRoom: Room) => {
    onParticipantRemoved(updatedRoom);
  });
  socket.on("room_locked", (updatedRoom: Room) => {
    onRoomUpdate(updatedRoom);
  });
  socket.on("room_unlocked", (updatedRoom: Room) => {
    onRoomUpdate(updatedRoom);
  });
  socket.on("code_output", (codeOutput: { stdout: string }) => {
    onConsoleUpdate(codeOutput);
  });

  socket.emit("join", { roomId, token });

  return socket;
};
