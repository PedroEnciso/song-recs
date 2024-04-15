import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import type { Song } from "../models/types";

export async function SpotifySession() {
  let sdk = initializeSpotifySDK();

  function initializeSpotifySDK() {
    return SpotifyApi.withClientCredentials(
      process.env.SPOTIFY_CLIENT_ID as string,
      process.env.SPOTIFY_CLIENT_SECRET as string
    );
  }

  async function getSongsByQuery(query: string): Promise<Song[]> {
    const response = await sdk.search(query, ["track"], undefined, 5);
    const songs = response.tracks.items;
    return songs.map((song) => ({
      id: song.id,
      album_name: song.album.name,
      artist: song.artists[0].name,
      name: song.name,
      album_photo_url: song.album.images[0].url,
    }));
  }

  async function getSongById(id: string): Promise<Song> {
    const response = await sdk.tracks.get(id);
    return {
      id: response.id,
      album_name: response.album.name,
      artist: response.artists[0].name,
      name: response.name,
      album_photo_url: response.album.images[0].url,
    };
  }

  return { getSongsByQuery, getSongById };
}
