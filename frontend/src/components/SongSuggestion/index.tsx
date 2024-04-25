import "./SongSuggestion.css";

function index({ name, artist, image_url, chooseSong }: Props) {
  return (
    <li onClick={chooseSong} className="song">
      <img src={image_url} alt="album cover image" />
      <div>
        <p className="name">{name}</p>
        <p className="artist">{artist}</p>
      </div>
    </li>
  );
}

export default index;

interface Props {
  name: string;
  artist: string;
  image_url: string;
  chooseSong: () => void;
}
