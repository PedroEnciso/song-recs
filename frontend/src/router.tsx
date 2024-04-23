import { createBrowserRouter } from "react-router-dom";

import Root from "routes/root";
import Home from "src/routes/Home/Home";
import ErrorPage from "./ErrorPage";

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
    ],
  },
]);
