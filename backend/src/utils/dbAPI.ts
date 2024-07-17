import { db } from "../db/client";
import type { InsertPlaylist } from "../db/schema";
import { playlistTable } from "../db/schema";

const dbAPI = {
  async insertPlaylist(newPlaylist: InsertPlaylist) {
    return await db.insert(playlistTable).values(newPlaylist).returning();
  },

  async getPlaylistRecommendations(id: number) {
    return await db.query.recommendationTable.findMany({
      where: (recommendations, { eq }) => eq(recommendations.playlistId, id),
    });
  },
};

export default dbAPI;
