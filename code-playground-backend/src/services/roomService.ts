import { db } from "../db";
import { rooms, users, roomParticipants } from "../db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq, and } from "drizzle-orm/expressions";
import { User, Room, CodeData } from "../types/types";

export class RoomService {
  async createRoom(userId: string): Promise<Room> {
    const roomId = uuidv4();

    const initialCodeData: CodeData = {
      content: "// Start coding here",
      lastEditedBy: null,
      lastEditedAt: null,
      programmingLanguage: "JavaScript",
    };

    await db.transaction(async tx => {
      await tx.insert(rooms).values({
        id: roomId,
        ownerId: userId,
        codeData: initialCodeData,
      });

      await tx.insert(roomParticipants).values({
        roomId: roomId,
        userId: userId,
      });
    });

    const owner = await this.getUserById(userId);
    return {
      roomId,
      owner,
      participants: [owner],
      codeData: initialCodeData,
    };
  }

  async joinRoom(roomId: string, userId: string): Promise<Room> {
    console.log(`Attempting to join room ${roomId} for user ${userId}`);

    // Check if the user exists
    const user = await this.getUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the room exists
    const [roomExists] = await db
      .select({ id: rooms.id })
      .from(rooms)
      .where(eq(rooms.id, roomId))
      .limit(1);

    if (!roomExists) {
      throw new Error("Room not found");
    }

    // Add the user to the room_participants table
    await db
      .insert(roomParticipants)
      .values({
        roomId,
        userId,
      })
      .onConflictDoNothing()
      .execute();

    // Fetch the updated room data
    return this.getRoom(roomId);
  }

  async leaveRoom(roomId: string, userId: string): Promise<Room> {
    // Remove the participant from the roomParticipants table
    await db
      .delete(roomParticipants)
      .where(
        and(
          eq(roomParticipants.roomId, roomId),
          eq(roomParticipants.userId, userId)
        )
      );

    // Fetch the updated room data
    return this.getRoom(roomId);
  }

  async getRoom(roomId: string): Promise<Room> {
    const roomResult = await db
      .select({
        roomId: rooms.id,
        ownerId: rooms.ownerId,
        codeData: rooms.codeData,
      })
      .from(rooms)
      .where(eq(rooms.id, roomId))
      .execute();

    if (roomResult.length === 0) {
      throw new Error("Room not found");
    }

    const room = roomResult[0];

    const participants = await db
      .select({
        id: users.id,
        username: users.username,
      })
      .from(roomParticipants)
      .innerJoin(users, eq(roomParticipants.userId, users.id))
      .where(eq(roomParticipants.roomId, roomId))
      .execute();

    const owner = await this.getUserById(room.ownerId);

    if (!owner) {
      throw new Error("Room owner not found");
    }

    return {
      roomId: room.roomId,
      owner,
      participants,
      codeData: room.codeData as CodeData,
    };
  }

  private async getUserById(userId: string): Promise<User> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
      .execute();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}
