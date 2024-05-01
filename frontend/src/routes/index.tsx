import { createBrowserRouter } from "react-router-dom";
import UserRoot from "src/routes/UserRoot";
import Home from "src/routes/Home/Home";
import History from "src/routes/History";
import Admin from "src/routes/admin/Admin";
import AdminDashboard from "src/routes/admin/Dashboard/Dashboard";
import ErrorPage from "../ErrorPage";
import authorizeLoader from "routes/admin/authorizeLoader";
import loginLoader from "routes/admin/loginLoader";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <UserRoot />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "history",
        element: <History />,
      },
    ],
  },
  {
    path: "admin",
    children: [
      {
        index: true,
        element: <Admin />,
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "login",
        loader: () => loginLoader(),
      },
      {
        path: "authorize",
        loader: ({ request }) => authorizeLoader(request),
      },
    ],
  },
]);
