import { FormEvent, useReducer, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getSongs } from "src/queries/getSongs";
import { postRecommendation } from "src/queries/postRecommendation";
import useDebounce from "src/hooks/debounce";
import RecForm from ".";
import { recommendationFormReducer } from "src/reducers/recommendationFormReducer";
import type { Field, State } from "src/reducers/recommendationFormReducer";
import type {
  Song,
  RecommendationWithoutId,
} from "src/../../backend/models/types";

const initialState: State = {
  query: "",
  name: "",
  message: "",
  selectedSong: null,
};

function RecFormContainer() {
  const [state, dispatch] = useReducer(recommendationFormReducer, initialState);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedQuery = useDebounce(state.query, 200);

  // react query properties for song fetch
  const { data, error, isLoading } = useQuery({
    queryKey: ["songs", debouncedQuery],
    queryFn: () => getSongs(debouncedQuery),
    enabled: debouncedQuery !== "",
  });

  // react query mutation for submitting a song
  const {
    mutate,
    isPending: postIsPending,
    isSuccess: postIsSuccess,
    isError: postIsError,
    error: postError,
  } = useMutation({
    mutationFn: (recommendation: RecommendationWithoutId) =>
      postRecommendation(recommendation),
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.log("submit", state);
    if (!state.selectedSong) return;
    mutate({
      spotify_song_id: state.selectedSong.id,
      recommender: state.name,
      comment: state.message,
    });
  }

  function updateInputField(
    field: Field,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    if (field === "query") {
      setShowSuggestions(true);
    }
    dispatch({
      type: "HANDLE INPUT TEXT",
      field,
      payload: e.target.value,
    });
  }

  function setSong(selected: Song) {
    setShowSuggestions(false);
    dispatch({ type: "SET SONG", payload: selected });
  }

  function clearSong() {
    dispatch({ type: "CLEAR SONG" });
  }

  function hideSuggestions() {
    setShowSuggestions(false);
  }

  const disableSubmitButton =
    !state.selectedSong || state.name === "" ? true : false;

  return !postIsSuccess ? (
    <RecForm
      handleSubmit={handleSubmit}
      updateQuery={updateInputField.bind(null, "query")}
      updateName={updateInputField.bind(null, "name")}
      updateMessage={updateInputField.bind(null, "message")}
      setSong={setSong}
      clearSong={clearSong}
      selectedSong={state.selectedSong}
      showSuggestions={showSuggestions}
      hideSuggestions={hideSuggestions}
      disableSubmit={disableSubmitButton}
      mutation={{ postIsPending, postIsError, postError }}
      suggestions={data}
      isLoading={isLoading}
      error={error}
    />
  ) : (
    <p>Thank you for submitting a recommendation, I really appreciate it!</p>
  );
}

export default RecFormContainer;
