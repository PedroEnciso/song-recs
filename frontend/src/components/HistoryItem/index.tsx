import styles from "./style.module.css";

function HistoryItem({
  song_name,
  artist_name,
  album_photo_url,
  recommender_comment,
  status,
  response_comment,
}: Props) {
  return (
    <div className={styles.item_container}>
      <div className={styles.rec_container}>
        <div className={styles.song_container}>
          <img className={styles.album_img} src={album_photo_url} />
          <div>
            <p className={styles.song_name}>{song_name}</p>
            <p>{artist_name}</p>
          </div>
        </div>
        <p>{recommender_comment}</p>
      </div>
      <div className={styles.admin_comment}>
        {status === "pending" ? (
          <p className={`status ${styles.pending}`}>No action yet</p>
        ) : null}
        {status === "added" ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.added}
            >
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            <p className={`${styles.status} ${styles.added}`}>
              Added to playlist
            </p>
          </>
        ) : null}
        {status === "removed" ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.removed}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="9" x2="15" y2="15"></line>
              <line x1="15" y1="9" x2="9" y2="15"></line>
            </svg>
            <p className={`${styles.status} ${styles.removed}`}>
              Declined by admin
            </p>
          </>
        ) : null}
      </div>
      {response_comment === null ? (
        <p className={`${styles.admin_comment} ${styles.pending}`}>
          No comment
        </p>
      ) : (
        <p className={styles.admin_comment}>{response_comment}</p>
      )}
    </div>
  );
}

export default HistoryItem;

interface Props {
  song_name: string;
  artist_name: string;
  album_photo_url: string;
  recommender_comment: string;
  status: "pending" | "added" | "removed";
  response_comment: string | null;
}
