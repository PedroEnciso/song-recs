import "./Home.css";

function Home() {
  return (
    <div>
      <h1>Welcome to my song rec app!</h1>
      <p className="info-text">
        You can add a song to my spotify playlist using the form below. Songs
        are not added automatically, so do not be alarmed if you do not
        immediately see it in my playlist. You will be able to see the status of
        your song rec in your rec history.
      </p>
    </div>
  );
}

export default Home;
