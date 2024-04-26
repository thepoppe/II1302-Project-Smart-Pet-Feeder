import HomePage from "./Views/HomePageView";
import Schedule from "./Views/ScheduleView";
import Status from "./Views/StatusView";
import Settings from "./Views/SettingsView";
import ErrorPage from "./Views/ErrorPage";
import LoginView from "./Views/LoginView";
import TopBar from "./Components/TopBar";
import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./index.css";



export const ModelContext = React.createContext();

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
   
    <>
    <TopBar></TopBar>
    <ModelContext.Provider value={loggedIn}>
      <Routes>
        <Route
          path="/"
          element={
            loggedIn ? (
             <HomePage/>
            ) : (
              <LoginView login={() => setLoggedIn(true)} />
            )
          }
        />
        <Route
          path="/schedule"
          element={loggedIn ? <Schedule /> : <Navigate to={"/"} />}
        />
        <Route
          path="/status"
          element={loggedIn ? <Status /> : <Navigate to={"/"} />}
        />
        <Route
          path="/settings"
          element={loggedIn ? <Settings /> : <Navigate to={"/"} />}
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </ModelContext.Provider>
  </>
  );
}

export default App;
