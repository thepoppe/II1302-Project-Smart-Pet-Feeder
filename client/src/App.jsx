import { useState } from "react";
import "./App.css";
import HomePageView from './HomePageView';

function App() {
  const [content, setContent] = useState("none");
  const [msg, setMsg] = useState("default");
  const [isDispensing, setIsDispensing] = useState(false);

  //default message
  function contactServer() {
    fetch("http://localhost:3000/")
      .then((response) => response.text())
      .then((data) => setContent(data))
      .catch((error) => console.error("Error:", error));
  }

/**
 * HTTP methodes POST: send data to the server to create or
 *  update a resource
 */
  function stopDispensing(){
    setIsDispensing(false);
    fetch('http://localhost:3000/stop', {method: 'POST'})
    .then(response => response.json())
    .then(data => {
      console.log('Dispensing stopped:', data);
    })
    .catch(error => {
      console.error('Error stopping dispensing:', error);
    });
  }

  function startDispensing(){
    setIsDispensing(true);
    fetch('http://localhost:3000/start', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
      console.log('Dispensing started:', data);
    })
    .catch(error => {
      console.error('Error starting dispensing:', error);
    });
  }

  //change variable
  function contactServerB() {
    const queryParams = new URLSearchParams({ data: msg });
    fetch(`http://localhost:3000/post-var?${queryParams}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: msg }),
    })
      .then((response) => response.json())
      .then((data) => {
        setContent(data.message);
        console.log(data.message);
      })
      .catch((error) => console.error("Error:", error));
  }
  //reset variable
  function contactServerC() {
    fetch(`http://localhost:3000/post-reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setContent(data.message);
        console.log(data.message);
      })
      .catch((error) => console.error("Error:", error));
  }

  //custom message
  function contactServerA() {
    const queryParams = new URLSearchParams({ data: msg });
    fetch(`http://localhost:3000/a?${queryParams}`)
      .then((response) => response.text())
      .then((data) => setContent(data))
      .catch((error) => console.error("Error:", error));
  }

  return (
    <>
      <p>{content}</p>
      <input onChange={(event) => setMsg(event.target.value)}></input>
      <div>
        <button onClick={() => contactServer()}>
          Click for default server msg
        </button>
        <button onClick={() => contactServerA()}>
          Click for custom server msg
        </button>
        <button onClick={() => contactServerB()}>
          Click for change variable on server
        </button>
        <button onClick={() => contactServerC()}>
          Click to reset variable on server
        </button>
        <HomePageView
          isDispensing={isDispensing}
          onStartDispensing={startDispensing}
          onStopDispensing={stopDispensing}
        />
      </div>
    </>
  );
}

export default App;
