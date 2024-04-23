import * as React from "react";
import * as ReactDOM from "react-dom/client";
import HomePage from "./Views/HomePageView";
import Schedule from "./Views/ScheduleView";
import Status from "./Views/StatusView";
import Settings from "./Views/SettingsView"
import ErrorPage from "./Views/ErrorPage"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/schedule",
    element: <Schedule/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/status",
    element: <Status/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/settings",
    element: <Settings/>,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
