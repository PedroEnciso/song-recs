import { Outlet } from "react-router-dom";
import UserNavigation from "src/components/UserNavigation";

import style from "./root.module.css";

function UserRoot() {
  return (
    <>
      <header className={style.header}>
        <UserNavigation />
      </header>
      <main className={style.main}>
        <Outlet />
      </main>
    </>
  );
}

export default UserRoot;
