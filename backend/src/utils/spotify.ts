import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import type { Song } from "../models/types";

export async function SpotifySession() {
  const spotifyClientId = process.env.SPOTIFY_CLIENT_ID as string;
  const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET as string;
  const spotifyPlaylistId = process.env.SPOTIFY_PLAYLIST_ID as string;

  let sdk = initializeSpotifySDK();

  function initializeSpotifySDK() {
    return SpotifyApi.withClientCredentials(
      spotifyClientId,
      spotifyClientSecret
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

  async function addSongToPlaylist(songId: string) {
    const response = await sdk.playlists.addItemsToPlaylist(spotifyPlaylistId, [
      `spotify:track:${songId}`,
    ]);
    console.log(response);
  }

  return { getSongsByQuery, getSongById, addSongToPlaylist };
}
