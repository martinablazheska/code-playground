import {
  pgTable,
  uuid,
  text,
  timestamp,
  primaryKey,
  jsonb,
} from "drizzle-orm/pg-core";
import {
  ProgrammingLanguage,
  DEFAULT_LANGUAGE,
} from "@/types/programmingLanguages";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  programmingLanguage: text("programming_language")
    .notNull()
    .$type<ProgrammingLanguage>()
    .default(DEFAULT_LANGUAGE),
  codeData: jsonb("code_data").notNull().default({
    content: "// Start coding here",
    lastEditedBy: null,
    lastEditedAt: null,
  }),
  privacyType: text("privacy_type")
    .notNull()
    .default("public")
    .$type<"private" | "public">(),
});

export const roomParticipants = pgTable(
  "room_participants",
  {
    roomId: uuid("room_id")
      .notNull()
      .references(() => rooms.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  table => ({
    pk: primaryKey({ columns: [table.roomId, table.userId] }),
  })
);
