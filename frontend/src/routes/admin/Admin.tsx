import { Outlet } from "react-router-dom";

function Admin() {
  return (
    <>
      <div>Admin page</div>
      <Outlet />
    </>
  );
}

export default Admin;
