import React, { FormEvent } from "react";

import "./RecForm.css";

interface Props {
  handleSubmit: (e: FormEvent) => void;
  updateQuery: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function RecForm({ handleSubmit, updateQuery }: Props) {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-group">
            <span>Your name</span>
            <input type="text" placeholder="Username" className="input-field" />
          </label>
        </div>

        <div className="form-group">
          <label className="form-group">
            <span>Message</span>
            <textarea
              className="input-field"
              placeholder="A message to the listener"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            <span>Song</span>
            <input
              onChange={(e) => updateQuery(e)}
              type="text"
              placeholder="Your song"
              className="input-field"
            />
          </label>
          <p className="song-input-message">
            <small>Song choices will appear below the form.</small>
          </p>
        </div>

        <button className="submit-button">Submit song</button>
      </form>
    </>
  );
}

export default RecForm;
