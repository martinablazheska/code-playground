import { Server as SocketIOServer, Socket } from "socket.io";
import { RoomService } from "../services/roomService";
import { AuthService } from "../services/authService";

const roomService = new RoomService();
const authService = new AuthService();

export const setupSocketHandlers = (io: SocketIOServer) => {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected");

    // Store the user's information in the socket object
    let userId: string | null = null;
    let currentRoomId: string | null = null;

    socket.on("join", async ({ roomId, token }) => {
      console.log("Received join event with:", {
        roomId,
        token: token.substring(0, 10) + "...",
      }); // partial token for debugging

      try {
        userId = authService.verifyToken(token);
        const room = await roomService.joinRoom(roomId, userId);
        currentRoomId = roomId;

        socket.join(roomId);
        io.to(roomId).emit("room:update", room);
        console.log(`User ${userId} joined room ${roomId}`);
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("error", "Failed to join room");
      }
    });

    socket.on("leave_room", async ({ roomId, userName }) => {
      try {
        const room = await roomService.leaveRoom(roomId, userName);
        socket.leave(roomId);
        io.to(roomId).emit("room:update", room);
        console.log(`User ${userName} left room ${roomId}`);
      } catch (error) {
        console.error("Error leaving room:", error);
        socket.emit("error", "Failed to leave room");
      }
    });

    socket.on("disconnect", async () => {
      console.log("A user disconnected");

      if (userId && currentRoomId) {
        try {
          const updatedRoom = await roomService.removeParticipant(
            currentRoomId,
            userId
          );

          // Notify other users in the room
          socket
            .to(currentRoomId)
            .emit("user:left", { userId, roomId: currentRoomId });

          // Send updated room information
          io.to(currentRoomId).emit("room:update", updatedRoom);

          console.log(`User ${userId} removed from room ${currentRoomId}`);
        } catch (error) {
          console.error("Error removing user from room:", error);
        }
      }
    });
  });
};
