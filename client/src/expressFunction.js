export function toggleMotor() {
  fetch("http://localhost:3000/toggle-motor", {
    method: "POST",
  })
    .then((response) => response.text())
    .then((data) => setContent(data))
    .catch((error) => console.error("Error:", error));
}


export function getSchedules() {
  fetch('http://localhost:3000/allSchedules')
  .then(response => response.json())
  .then(data => {
      setSchedules(data); 
      console.log(data);  
  })
  .catch(error => console.error('Error:', error));
}

export function sendData(datetime){
    
  const date = new Date(datetime);
  const month= date.getMonth();
  const day=date.getDate(); 
  const hour = date.getHours();
  const minute = date.getMinutes();

  fetch('http://localhost:3000/schedule', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({month, day, hour, minute })  
  })
  .then(response => response.json())
  .then(data => {   
          getSchedules(data);   
  })
  .catch(error => console.error('Error:', error));
};