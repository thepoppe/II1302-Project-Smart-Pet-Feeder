import { useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";

export default function LoginView(props) {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  async function confirmLoginWithServer(token) {
    console.log("Validating against server");
    try {
      const response = await fetch("http://localhost:3000/login", {
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

      console.log("Logging in");
      props.login();
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
        console.log(
          "success storing token in localstorage with key: " + props.key
        );
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
      <span className="login">Welcome to our app.</span>
      <h2> Log in with your Google account to customize your Pet Feeder.</h2>
      <div>
        <button onClick={() => handleLogin()}>Press to log in</button>
      </div>
    </div>
  );
}
