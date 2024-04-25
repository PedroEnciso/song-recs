import type { Song } from "../../../backend/models/types";

export function recommendationFormReducer(state: State, action: Action): State {
  if (action.type === "HANDLE INPUT TEXT") {
    return {
      ...state,
      [action.field]: action.payload,
    };
  }
  if (action.type === "SET SONG") {
    return {
      ...state,
      selectedSong: action.payload,
    };
  }
  if (action.type === "CLEAR SONG") {
    return {
      ...state,
      selectedSong: null,
    };
  }
  return state;
}

export type State = {
  query: string;
  name: string;
  message: string;
  selectedSong: Song | null;
};

type Action =
  | { type: "HANDLE INPUT TEXT"; field: Field; payload: string }
  | { type: "SET SONG"; payload: Song }
  | { type: "CLEAR SONG" };

export type Field = "query" | "name" | "message";
