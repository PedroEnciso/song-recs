import { Outlet } from "react-router-dom";

import "./root.css";

function root() {
  return (
    <main>
      <Outlet />
    </main>
  );
}

export default root;
