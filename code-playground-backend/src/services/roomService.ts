import { db } from "../db";
import { rooms, users, roomParticipants } from "../db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq, and } from "drizzle-orm/expressions";
import { User, Room, CodeData } from "../types/types";
import {
  ProgrammingLanguage,
  DEFAULT_LANGUAGE,
} from "../constants/programmingLanguages";

export class RoomService {
  async createRoom(
    userId: string,
    name: string,
    programmingLanguage: ProgrammingLanguage = DEFAULT_LANGUAGE
  ): Promise<Room> {
    const roomId = uuidv4();

    const initialCodeData: CodeData = {
      content: "// Start coding here",
      lastEditedBy: null,
      lastEditedAt: null,
    };

    await db.insert(rooms).values({
      id: roomId,
      name,
      ownerId: userId,
      programmingLanguage,
      codeData: initialCodeData,
    });

    const owner = await this.getUserById(userId);
    return {
      roomId,
      name,
      owner,
      participants: [owner],
      codeData: initialCodeData,
      programmingLanguage,
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
        name: rooms.name,
        programmingLanguage: rooms.programmingLanguage,
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
      name: room.name,
      participants,
      codeData: room.codeData as CodeData,
      programmingLanguage: room.programmingLanguage,
    };
  }

  private async getUserById(userId: string): Promise<User> {
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
      .execute();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async updateRoomCodeData(roomId: string, content: string): Promise<void> {
    const [currentRoom] = await db
      .select({
        codeData: rooms.codeData,
      })
      .from(rooms)
      .where(eq(rooms.id, roomId))
      .limit(1);

    if (!currentRoom) {
      throw new Error("Room not found");
    }

    const currentCodeData = currentRoom.codeData as CodeData;

    await db
      .update(rooms)
      .set({
        codeData: {
          content,
          lastEditedAt: new Date().toISOString(),
          lastEditedBy: currentCodeData.lastEditedBy,
        },
      })
      .where(eq(rooms.id, roomId));
  }
}
