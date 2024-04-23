import HomePage from "./Views/HomePageView";
import Schedule from "./Views/ScheduleView";
import Status from "./Views/StatusView";
import Settings from "./Views/SettingsView";
import ErrorPage from "./Views/ErrorPage";

import { Route, Routes } from "react-router-dom";
import "./index.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} errorElement={<ErrorPage />} />
        <Route
          path="/schedule"
          element={<Schedule />}
          errorElement={<ErrorPage />}
        />
        <Route
          path="/status"
          element={<Status />}
          errorElement={<ErrorPage />}
        />
        <Route
          path="/settings"
          element={<Settings />}
          errorElement={<ErrorPage />}
        />
        <Route
          path="/status"
          element={<Status />}
          errorElement={<ErrorPage />}
        />
      </Routes>
    </>
  );
}

export default App;
