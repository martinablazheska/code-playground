import { db } from "../db";
import { rooms, users, roomParticipants } from "../db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq, and, ne } from "drizzle-orm/expressions";
import { User, Room, CodeData } from "../types/types";
import {
  ProgrammingLanguage,
  DEFAULT_LANGUAGE,
} from "../types/programmingLanguages";
import { AuthService } from "../services/authService";

export class RoomService {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async createRoom(
    userId: string,
    name: string,
    programmingLanguage: ProgrammingLanguage = DEFAULT_LANGUAGE,
    privacyType: "private" | "invite-only" | "public" = "public"
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
      privacyType,
    });

    const owner = await this.getUserById(userId);
    return {
      roomId,
      name,
      owner,
      participants: [owner],
      codeData: initialCodeData,
      programmingLanguage,
      privacyType,
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
    const [room] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, roomId))
      .limit(1);

    if (!room) {
      throw new Error("Room not found");
    }

    if (room.privacyType === "private" && room.ownerId !== userId) {
      throw new Error("This room is private");
    }

    if (room.privacyType === "invite-only") {
      // allow joining, implement approval later
      console.log("Invite-only room: Owner approval required");
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
        privacyType: rooms.privacyType,
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
      privacyType: room.privacyType,
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

  async removeParticipant(
    roomId: string,
    participantUsername: string
  ): Promise<Room> {
    const [room] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, roomId))
      .limit(1);

    if (!room) {
      throw new Error("Room not found");
    }

    // Find the user ID for the given username
    const [user] = await db
      .select({
        id: users.id,
      })
      .from(users)
      .where(eq(users.username, participantUsername))
      .limit(1);

    if (!user) {
      throw new Error("User not found");
    }

    const participantId = user.id;

    // Check if the participant is in the room
    const [participant] = await db
      .select()
      .from(roomParticipants)
      .where(
        and(
          eq(roomParticipants.roomId, roomId),
          eq(roomParticipants.userId, participantId)
        )
      )
      .limit(1);

    if (!participant) {
      throw new Error("Participant not found in the room");
    }

    // Remove the participant from the room
    await db
      .delete(roomParticipants)
      .where(
        and(
          eq(roomParticipants.roomId, roomId),
          eq(roomParticipants.userId, participantId)
        )
      );

    return this.getRoom(roomId);
  }

  async clearRoomAndSetPrivate(roomId: string): Promise<Room> {
    const [room] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, roomId))
      .limit(1);

    if (!room) {
      throw new Error("Room not found");
    }

    // Remove all participants except the owner
    await db
      .delete(roomParticipants)
      .where(
        and(
          eq(roomParticipants.roomId, roomId),
          ne(roomParticipants.userId, room.ownerId)
        )
      );

    // Set the room to private
    await db
      .update(rooms)
      .set({ privacyType: "private" })
      .where(eq(rooms.id, roomId));

    // Fetch the updated room data
    return this.getRoom(roomId);
  }
}
