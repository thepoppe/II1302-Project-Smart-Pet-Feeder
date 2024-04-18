import { useState, useEffect } from "react";
import "./index.css";




function App() {
  const [content, setContent] = useState("none");
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());

    }, 1000);
  }, []);

  function startMotor() {
    fetch(`http://localhost:3000/start-motor`)
      .then((response) => response.text())
      .then((data) => setContent(data))
      .catch((error) => console.error("Error:", error));
  }

  return (
    <div className="centered-button">
      <p>{content}</p>
      <p>Current Time: {time}</p>
      <button onClick={startMotor}>
        Start Motor
      </button>
    </div>
  );
}

export default App;
