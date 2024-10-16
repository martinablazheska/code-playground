import { db } from "../db";
import { rooms, users, roomParticipants } from "../db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm/expressions";

interface User {
  id: string;
  name: string;
}

interface Room {
  roomId: string;
  owner: User;
  participants: User[];
}

export class RoomService {
  async createRoom(ownerName: string): Promise<Room> {
    const ownerId = uuidv4();
    const roomId = uuidv4();

    await db.transaction(async tx => {
      await tx.insert(users).values({
        id: ownerId,
        name: ownerName,
      });

      await tx.insert(rooms).values({
        id: roomId,
        ownerId: ownerId,
      });

      await tx.insert(roomParticipants).values({
        roomId: roomId,
        userId: ownerId,
      });
    });

    return {
      roomId,
      owner: { id: ownerId, name: ownerName },
      participants: [{ id: ownerId, name: ownerName }],
    };
  }

  async joinRoom(roomId: string, userName: string): Promise<Room> {
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
      await tx.insert(users).values({
        id: userId,
        name: userName,
      });

      await tx.insert(roomParticipants).values({
        roomId: roomId,
        userId: userId,
      });
    });

    const participants = await db
      .select({
        id: users.id,
        name: users.name,
      })
      .from(roomParticipants)
      .innerJoin(users, eq(roomParticipants.userId, users.id))
      .where(eq(roomParticipants.roomId, roomId))
      .execute();

    return {
      roomId: room.roomId,
      owner: { id: room.ownerId, name: room.ownerName },
      participants,
    };
  }
}
