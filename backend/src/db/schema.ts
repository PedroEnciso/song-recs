import { integer, pgTable, pgEnum, serial, varchar } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["pending", "added", "rejected"]);

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
export const recommendationTable = pgTable("recommendation_table", {
  id: serial("id").primaryKey(),
  recommenderId: varchar("recommender_id"),
  status: statusEnum("status"),
  spotifySongId: varchar("spotify_song_id"),
  playlistId: integer("playlist_id")
    .notNull()
    .references(() => playlistTable.id, { onDelete: "cascade" }),
});

export type InsertCreator = typeof creatorTable.$inferInsert;
export type SelectCreator = typeof creatorTable.$inferSelect;
export type InsertPlaylist = typeof playlistTable.$inferInsert;
export type SelectPlaylist = typeof playlistTable.$inferSelect;
export type InsertRecommendation = typeof recommendationTable.$inferInsert;
export type SelectRecommendation = typeof recommendationTable.$inferSelect;
