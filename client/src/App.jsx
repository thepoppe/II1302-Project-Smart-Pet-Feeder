import { useState } from "react";
import "./index.css";

function App() {
  const [content, setContent] = useState("none");
  const [msg, setMsg] = useState("default");

  
  function startMotor() {
    fetch(`http://localhost:3000/start-motor`)
      .then((response) => response.text())
      .then((data) => setContent(data) )
      .catch((error) => console.error("Error:", error));
  }



  return (
    <div className="centered-button">
      <p>{content}</p>
      <button onClick={() => startMotor()}>
        Start Motor
      </button>
    </div>
  );

}
export default App;
