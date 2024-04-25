import SongSuggestion from "components/SongSuggestion";
import { Song } from "../../../../backend/models/types";
import "./SongSuggestion.css";

function SongSuggestionContainer({ songs, handleChooseSong }: Props) {
  if (!songs || songs.length === 0) return null;

  return (
    <ul className="container">
      {songs.map((song) => (
        <SongSuggestion
          key={song.id}
          name={song.name}
          artist={song.artist}
          image_url={song.album_photo_url}
          chooseSong={handleChooseSong.bind(null, song)}
        />
      ))}
    </ul>
  );
}

export default SongSuggestionContainer;

interface Props {
  songs: Song[] | undefined;
  handleChooseSong: (song: Song) => void;
}
