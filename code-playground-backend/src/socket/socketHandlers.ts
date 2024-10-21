import { Server as SocketIOServer, Socket } from "socket.io";
import { RoomService } from "@/services/roomService";
import { AuthService } from "@/services/authService";

const roomService = new RoomService();
const authService = new AuthService();

export const setupSocketHandlers = (io: SocketIOServer) => {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected");

    // Store the user's information in the socket object
    let userId: string | null = null;
    let currentRoomId: string | null = null;

    socket.on("join", async ({ roomId, token }) => {
      try {
        userId = authService.getUserId(token);
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

    socket.on(
      "remove_participant",
      async ({ roomId, participantId, token }) => {
        userId = authService.getUserId(token);
        const room = await roomService.removeParticipant(
          roomId,
          participantId,
          userId
        );
        io.to(roomId).emit("participant_removed", room);
      }
    );

    socket.on("lock_room", async ({ roomId, token }) => {
      userId = authService.getUserId(token);
      const room = await roomService.setRoomPrivate(roomId, userId);
      io.to(roomId).emit("room_locked", room);
    });

    socket.on("unlock_room", async ({ roomId, token }) => {
      userId = authService.getUserId(token);
      const room = await roomService.setRoomPublic(roomId, userId);
      io.to(roomId).emit("room_unlocked", room);
    });

    socket.on("leave_room", async ({ roomId, userName }) => {
      await handleUserLeavingRoom(socket, io, roomId, userName);
    });

    socket.on("disconnect", async () => {
      console.log("A user disconnected");
      if (userId && currentRoomId) {
        await handleUserLeavingRoom(socket, io, currentRoomId, userId, true);
      }
    });

    // Improvement: update the room from a single socket (which one?)
    socket.on("update_code_content", async ({ roomId, content }) => {
      await roomService.updateRoomCodeData(roomId, content);
    });

    socket.on("run_code", async ({ roomId, content }) => {
      await roomService.updateRoomCodeData(roomId, content);
      const output = await roomService.runCode(roomId);
      io.to(roomId).emit("code_output", output);
      console.log(output);
    });
  });
};

async function handleUserLeavingRoom(
  socket: Socket,
  io: SocketIOServer,
  roomId: string,
  userId: string,
  isDisconnect: boolean = false
) {
  try {
    const updatedRoom = await roomService.leaveRoom(roomId, userId);

    if (!isDisconnect) {
      socket.leave(roomId);
    }

    socket.to(roomId).emit("user:left", { userId, roomId });
    io.to(roomId).emit("room:update", updatedRoom);
    console.log(`User ${userId} left room ${roomId}`);
  } catch (error) {
    console.error("Error handling user leaving room:", error);
    if (!isDisconnect) {
      socket.emit("error", "Failed to leave room");
    }
  }
}
