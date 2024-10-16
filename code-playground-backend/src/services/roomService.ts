import { db } from "../db";
import { rooms, users, roomParticipants } from "../db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm/expressions";

export class RoomService {
  async createRoom(ownerName: string) {
    const userId = uuidv4();
    const roomId = uuidv4();

    await db.transaction(async tx => {
      // Create user
      await tx.insert(users).values({
        id: userId,
        name: ownerName,
      });

      // Create room
      await tx.insert(rooms).values({
        id: roomId,
        ownerId: userId,
      });

      // Add owner as participant
      await tx.insert(roomParticipants).values({
        roomId: roomId,
        userId: userId,
      });
    });

    return { roomId, ownerId: userId };
  }

  async joinRoom(roomId: string, userName: string) {
    const room = await db.query.rooms.findFirst({
      where: eq(rooms.id, roomId),
    });

    if (!room) {
      throw new Error("Room not found");
    }

    const userId = uuidv4();

    await db.transaction(async tx => {
      // Create new user
      await tx.insert(users).values({
        id: userId,
        name: userName,
      });

      // Add user as room participant
      await tx.insert(roomParticipants).values({
        roomId: roomId,
        userId: userId,
      });
    });

    return { roomId, userId };
  }
}
