import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rooms = pgTable("rooms", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const roomParticipants = pgTable("room_participants", {
  roomId: uuid("room_id")
    .notNull()
    .references(() => rooms.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});
