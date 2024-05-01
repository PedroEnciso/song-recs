import { NavLink } from "react-router-dom";
import style from "./UserNavigation.module.css";

function UserNavigation() {
  return (
    <nav>
      <ul className={style.nav_container}>
        <NavLink
          end
          to="/"
          className={({ isActive }) =>
            isActive ? style.active : style.inactive
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) =>
            isActive ? style.active : style.inactive
          }
        >
          History
        </NavLink>
      </ul>
    </nav>
  );
}

export default UserNavigation;
