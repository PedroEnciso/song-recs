import { useQuery } from "@tanstack/react-query";
import { getUserHistory } from "src/queries/getUserHistory";
import HistoryItem from "src/components/HistoryItem";
import styles from "./styles.module.css";

function History() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["history"],
    queryFn: getUserHistory,
  });

  if (isLoading) {
    return <>Loading data</>;
  }

  if (error) {
    return <>{error.message}</>;
  }

  return (
    <ul className={styles.container}>
      {data &&
        data.map((rec) => (
          <li key={rec.id}>
            <HistoryItem
              song_name={rec.song.name}
              artist_name={rec.song.artist}
              album_photo_url={rec.song.album_photo_url}
              recommender_comment={rec.comment}
              status={rec.status}
              response_comment={rec.response.comment}
            />
          </li>
        ))}
    </ul>
  );
}

export default History;
