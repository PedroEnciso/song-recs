import { integer, pgTable, pgEnum, serial, varchar } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["pending", "added", "rejected"]);

export const playlistTable = pgTable("playlist_table", {
  id: varchar("id").primaryKey(),
  creatorId: varchar("creator_id").notNull(),
  name: varchar("name").notNull(),
});
export const recommendationTable = pgTable("recommendation_table", {
  id: serial("id").primaryKey(),
  recommenderId: varchar("recommender_id").notNull(),
  status: statusEnum("status").notNull(),
  spotifySongId: varchar("spotify_song_id").notNull(),
  playlistId: integer("playlist_id")
    .notNull()
    .references(() => playlistTable.id, { onDelete: "cascade" }),
});

export type InsertPlaylist = typeof playlistTable.$inferInsert;
export type SelectPlaylist = typeof playlistTable.$inferSelect;
export type InsertRecommendation = typeof recommendationTable.$inferInsert;
export type SelectRecommendation = typeof recommendationTable.$inferSelect;
