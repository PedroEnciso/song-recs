import { useState, FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSongs } from "src/queries/getSongs";
import RecForm from "src/components/RecForm";

import "./Home.css";

function Home() {
  const [query, setQuery] = useState("");

  const { data, error } = useQuery({
    queryKey: ["songs"],
    queryFn: () => getSongs(query),
    enabled: query !== "",
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.log("submitting form");
  }

  function updateQuery(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  if (data) {
    console.log(data);
  }

  return (
    <>
      <section className="top-section">
        <h1 className="text-xl">Welcome to song recs</h1>
        <p className="info-text">
          This app allows you to add a song to my spotify account. You will be
          able to see the status of your song rec in your rec history.
        </p>
      </section>
      <section className="form-section">
        <RecForm handleSubmit={handleSubmit} updateQuery={updateQuery} />
      </section>

      <section>
        <div> {data ? data[0].name : "no data"}</div>
        <div> {error ? error.message : "no error"}</div>
      </section>
    </>
  );
}

export default Home;
