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
    const roomResult = await db
      .select({
        roomId: rooms.id,
        ownerId: rooms.ownerId,
        ownerName: users.name,
      })
      .from(rooms)
      .innerJoin(users, eq(rooms.ownerId, users.id))
      .where(eq(rooms.id, roomId))
      .execute();

    if (roomResult.length === 0) {
      throw new Error("Room not found");
    }

    const room = roomResult[0];
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

    return {
      roomId: room.roomId,
      ownerId: room.ownerId,
      ownerName: room.ownerName,
      participantId: userId,
      participantName: userName,
    };
  }
}
