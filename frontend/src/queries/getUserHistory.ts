import type { HistoryItem } from "../../../backend/models/types";

const sampleSong = {
  id: "0rH0mprtecH3grD9HFM5AD",
  album_name: "album name",
  name: "song name",
  album_photo_url:
    "https://images.unsplash.com/photo-1509978778156-518eea30166b?q=80&w=1615&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  artist: "artist",
};

const sampleData: HistoryItem[] = [
  {
    id: "1",
    recommender: "Ped",
    comment: "I think you will like this song.",
    song: sampleSong,
    status: "added",
    response: {
      rate: true,
      comment: "I like this song.",
    },
  },
  {
    id: "2",
    recommender: "Petr",
    comment: "This song rules",
    song: sampleSong,
    status: "removed",
    response: {
      rate: false,
      comment: "I did not like this song.",
    },
  },
  {
    id: "3",
    recommender: "Pedge",
    comment: "This song is stuck in my head",
    song: sampleSong,
    status: "pending",
    response: {
      rate: null,
      comment: null,
    },
  },
];

export async function getUserHistory(): Promise<HistoryItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sampleData);
    }, 5000);
  });
}
