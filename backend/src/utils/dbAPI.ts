import { db } from "../db/client";
import type { InsertPlaylist } from "../db/schema";
import { playlistTable, recommendationTable } from "../db/schema";
import { eq } from "drizzle-orm";

const dbAPI = {
  async getPlaylist(id: string) {
    return await db.query.playlistTable.findFirst({
      where: (playlists, { eq }) => eq(playlists.id, id),
    });
  },

  async insertPlaylist(newPlaylist: InsertPlaylist) {
    return await db.insert(playlistTable).values(newPlaylist).returning();
  },

  async getPlaylistRecommendations(id: number) {
    return await db.query.recommendationTable.findMany({
      where: (recommendations, { eq }) => eq(recommendations.playlistId, id),
    });
  },

  async updateRecommendationStatus(
    newStatus: "added" | "pending" | "rejected",
    recommendationId: number
  ) {
    return await db
      .update(recommendationTable)
      .set({ status: newStatus })
      .where(eq(recommendationTable.id, recommendationId))
      .returning();
  },
};

export default dbAPI;
