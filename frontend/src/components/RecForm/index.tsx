import React, { FormEvent } from "react";
import SongSuggestionContainer from "components/SongSuggestion/Container";
import styles from "./RecForm.module.css";
import { Song } from "../../../../backend/models/types";

function RecForm({
  handleSubmit,
  updateQuery,
  updateName,
  updateMessage,
  setSong,
  clearSong,
  selectedSong,
  showSuggestions,
  hideSuggestions,
  disableSubmit,
  mutation,
  suggestions,
  isLoading,
  error,
}: Props) {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className={styles["form-group"]}>
          <label>
            <span>Your name</span>
            <input
              onFocus={hideSuggestions}
              onChange={updateName}
              type="text"
              placeholder="Username"
              className={styles["input-field"]}
            />
          </label>
        </div>

        <div className={styles["form-group"]}>
          <label>
            <span>Message</span>
            <textarea
              onFocus={hideSuggestions}
              onChange={updateMessage}
              className={styles["input-field"]}
              placeholder="A message to the listener"
            />
          </label>
        </div>

        <div className={styles["form-group"]}>
          <label>
            <span>Song</span>
            {selectedSong ? (
              <div className={styles["selected-song"]}>
                <button onClick={clearSong}>remove</button>
                <div className={styles["song-info"]}>
                  <img src={selectedSong.album_photo_url} />
                  <div>
                    <p className={styles.name}>{selectedSong.name}</p>
                    <p className={styles.artist}>{selectedSong.artist}</p>
                  </div>
                </div>
              </div>
            ) : (
              <input
                onChange={(e) => updateQuery(e)}
                type="text"
                placeholder="Your song"
                className={styles["input-field"]}
              />
            )}
          </label>
          {error ? (
            <p className={styles["error-message"]}>
              <small>{error.message}</small>
            </p>
          ) : null}
          {isLoading ? <p>Loading...</p> : null}
          {showSuggestions ? (
            <SongSuggestionContainer
              songs={suggestions}
              handleChooseSong={setSong}
            />
          ) : null}
        </div>

        <div>
          {mutation.postIsPending ? (
            <p>Submitting...</p>
          ) : (
            <button
              className={styles["submit-button"]}
              disabled={disableSubmit}
            >
              Submit song
            </button>
          )}
          {mutation.postIsError ? (
            <p className={styles["error-message"]}>
              {mutation.postError?.message === "429"
                ? "You exceeeded the rate limit. Please try again in 10 minutes."
                : "There was an issue posting this recommendation. Please refresh and try again."}
            </p>
          ) : null}
        </div>
      </form>
    </>
  );
}

export default RecForm;

interface Props {
  handleSubmit: (e: FormEvent) => void;
  updateQuery: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  updateName: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  updateMessage: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  setSong: (selected: Song) => void;
  clearSong: () => void;
  selectedSong: Song | null;
  showSuggestions: boolean;
  hideSuggestions: () => void;
  disableSubmit: boolean;
  mutation: {
    postIsPending: boolean;
    postIsError: boolean;
    postError: Error | null;
  };
  suggestions: Song[] | undefined;
  isLoading: boolean;
  error: Error | null;
}
