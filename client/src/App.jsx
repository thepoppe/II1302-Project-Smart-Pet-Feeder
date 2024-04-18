import { useState, useEffect } from "react";
import "./index.css";




function App() {
  const [content, setContent] = useState("Motor is stopped");
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());

    }, 1000);
  }, []);

  function toggleMotor() {
    fetch(`http://localhost:3000/toggle-motor`)
      .then((response) => response.text())
      .then((data) => setContent(data))
      .catch((error) => console.error("Error:", error));
  }

  return (
    <div className="centered-button">
      <p>{content}</p>
      <p>Current Time: {time}</p>
      <button onClick={toggleMotor}>
        Toggle Motor
      </button>
    </div>
  );
}

export default App;
