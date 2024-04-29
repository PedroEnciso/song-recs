import { createBrowserRouter } from "react-router-dom";
import Root from "routes/root";
import Home from "src/routes/Home/Home";
import Admin from "src/routes/admin/Admin";
import AdminDashboard from "src/routes/admin/Dashboard/Dashboard";
import ErrorPage from "./ErrorPage";
import authorizeLoader from "routes/admin/authorizeLoader";
import loginLoader from "routes/admin/loginLoader";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "admin",
        element: <Admin />,
        children: [
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
    ],
  },
]);
