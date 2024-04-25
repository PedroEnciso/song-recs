import RecFormContainer from "src/components/RecForm/Container";

import styles from "./Home.module.css";

function Home() {
  return (
    <>
      <section className={styles["top-section"]}>
        <h1 className={styles["text-xl"]}>Welcome to song recs</h1>
        <p className={styles["info-text"]}>
          This app allows you to add a song to my spotify account. You will be
          able to see the status of your song rec in your rec history.
        </p>
      </section>
      <section className={styles["form-section"]}>
        <RecFormContainer />
      </section>
    </>
  );
}

export default Home;
