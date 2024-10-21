import { db } from "../db";
import { rooms, users, roomParticipants } from "../db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq, and, ne } from "drizzle-orm/expressions";
import { User, Room, CodeData } from "@/types/types";
import {
  ProgrammingLanguage,
  DEFAULT_LANGUAGE,
} from "@/types/programmingLanguages";
import { Judge0Service } from "@/services/judge0Service";

export class RoomService {
  private judge0Service: Judge0Service;

  constructor() {
    this.judge0Service = new Judge0Service();
  }

  async createRoom(
    userId: string,
    name: string,
    programmingLanguage: ProgrammingLanguage = DEFAULT_LANGUAGE,
    privacyType: "private" | "public" = "public"
  ): Promise<Room> {
    // Generate random room id
    const roomId = uuidv4();

    const initialCodeData: CodeData = {
      content: "// Start coding here",
      lastEditedBy: null,
      lastEditedAt: null,
    };

    // Insert room in rooms table
    await db.insert(rooms).values({
      id: roomId,
      name,
      ownerId: userId,
      programmingLanguage,
      codeData: initialCodeData,
      privacyType,
    });

    // Get owner data
    const owner = await this.getUserById(userId);

    // Return room object
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

    // Check the room privacy type

    if (room.privacyType === "private" && room.ownerId !== userId) {
      throw new Error("This room is private");
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
    // Get rooom from database
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

    // Get participants
    const participants = await db
      .select({
        id: users.id,
        username: users.username,
      })
      .from(roomParticipants)
      .innerJoin(users, eq(roomParticipants.userId, users.id))
      .where(eq(roomParticipants.roomId, roomId))
      .execute();

    // Get owner user data
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
    // Get current room from database
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

    // Update room with code data
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
    // Get current room from database
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

  async setRoomPrivate(roomId: string): Promise<Room> {
    // Get current room from database
    const [room] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, roomId))
      .limit(1);

    if (!room) {
      throw new Error("Room not found");
    }

    // Set the room to private
    await db
      .update(rooms)
      .set({ privacyType: "private" })
      .where(eq(rooms.id, roomId));

    // Fetch the updated room data
    return this.getRoom(roomId);
  }

  async runCode(roomId: string): Promise<any> {
    // Get current room from database
    const room = await this.getRoom(roomId);
    const { content } = room.codeData;

    // Submit the code for execution and receive submission token
    const submissionToken = await this.judge0Service.submitCode(
      room.programmingLanguage,
      content
    );

    // Wait for a short time to allow the code to be processed
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Submit submission token to receive code output
    const result = await this.judge0Service.getSubmissionResult(
      submissionToken
    );

    return result;
  }
}
