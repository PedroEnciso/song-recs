import {
  integer,
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const creatorTable = pgTable("creator_table", {
  id: serial("id").primaryKey(),
  spotify_id: varchar("spotify_id").notNull(),
});
export const playlistTable = pgTable("playlist_table", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id")
    .notNull()
    .references(() => creatorTable.id, { onDelete: "cascade" }),
});
export type InsertCreator = typeof creatorTable.$inferInsert;
export type SelectCreator = typeof creatorTable.$inferSelect;
export type InsertPlaylist = typeof playlistTable.$inferInsert;
export type SelectPlaylist = typeof playlistTable.$inferSelect;
