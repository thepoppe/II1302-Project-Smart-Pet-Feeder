import { useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import "./login.css";
const ip = `http://${import.meta.env.SERVER_IP_ADDRESS}:3000`;

export default function LoginView(props) {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  async function confirmLoginWithServer(token) {
    console.log("Validating against server");
    try {
      const response = await fetch(`${ip}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) throw new Error("Failed to confirm login with server");

      const resp = await response.json();
      if (resp.valid !== true)
        throw new Error("Failed to confirm login with server");

      return { login: "success" };
    } catch (error) {
      console.error("Authentication failed:", error);
      return { login: "error" };
    }
  }
  async function handleLogin() {
    try {
      const success = await signInWithPopup(auth, provider);
      if (!success || !success.user) {
        throw new Error(
          "Sign-in with popup failed or missing user information"
        );
      }
      const idToken = await success.user.getIdToken();
      if (!idToken) {
        throw new Error("Failed to collect token");
      }
      const result = await confirmLoginWithServer(idToken);
      if (result.login === "success") {
        localStorage.setItem(props.storageKey, idToken);
        console.log("Logging in");
        props.login();
      } else {
        window.alert("Failed to log in");
      }
    } catch (error) {
      window.alert("Log in Failed");
      console.error("Authentication failed:", error);
    }
  }

  return (
    <div className="logincontainer">
      <div className="login"> Welcome to our app. </div>
      <div className="h2">
        {" "}
        Log in with your Google account to customize your Pet Feeder.
      </div>
      <div className="loginBTN">
        <button className="icon-button" onClick={handleLogin}>
          log in
        </button>
      </div>
    </div>
  );
}
