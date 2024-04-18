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
    fetch('http://localhost:3000/star-motor', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
      console.log('Dispensing started:', data);
    })
    .catch(error => {
      console.error('Error starting dispensing:', error);
    });
  }

  return(
    <div>
      <HomePageView
          isDispensing={isDispensing}
          onStartDispensing={startDispensing}
          onStopDispensing={stopDispensing}
        />
    </div>
  )
}

export default App;
