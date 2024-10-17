import { Server, Socket } from "socket.io";
import { RoomService } from "../services/roomService";

const roomService = new RoomService();

interface User {
  id: string;
  name: string;
}

interface CodeData {
  content: string;
  lastEditedBy: User | null;
  lastEditedAt: string | null;
}

export function setupSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("New Socket.IO connection");

    socket.on(
      "join_room",
      async (data: { roomId: string; userName: string }) => {
        const { roomId, userName } = data;

        try {
          let room = await roomService.joinRoom(roomId, userName);
          socket.join(roomId);

          socket.emit("room_joined", { room });
          socket.to(roomId).emit("user_joined", { userName });
        } catch (error) {
          console.error("Error joining room:", error);
          socket.emit("error", { message: "Failed to join room" });
        }
      }
    );

    socket.on("yjsUpdate", (data: { roomId: string; update: Uint8Array }) => {
      socket.to(data.roomId).emit("yjsUpdate", data.update);
    });

    socket.on(
      "save_code",
      async (data: { roomId: string; codeData: CodeData }) => {
        try {
          const { roomId, codeData } = data;
          await roomService.updateCode(
            roomId,
            codeData.content,
            codeData.lastEditedBy as User
          );
          socket.emit("save_success");
        } catch (error) {
          console.error("Error saving code:", error);
          socket.emit("save_error", { message: "Failed to save code" });
        }
      }
    );

    socket.on("disconnecting", () => {
      for (const room of socket.rooms) {
        if (room !== socket.id) {
          socket.to(room).emit("user_left", { socketId: socket.id });
        }
      }
    });
  });
}
