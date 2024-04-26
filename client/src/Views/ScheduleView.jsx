import React, { useState,useEffect } from 'react';
export default function ScheduleView(props) {
  const [datetime, setDatetime] = useState('');
  const [schedules, setSchedules]= useState([])

  function sendData(){
      
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

  function getSchedules() {
      fetch('http://localhost:3000/allSchedules')
      .then(response => response.json())
      .then(data => {
          setSchedules(data); 
          console.log(data);  
      })
      .catch(error => console.error('Error:', error));
  }

  useEffect(() => {
      getSchedules()
    
    },[]);
  return (
      <div>
          <input
              type="datetime-local"
              value={datetime}
              onChange={e => setDatetime(e.target.value)}
          />
          <button onClick={sendData}>Schedule feed</button> 
          <div>
              {schedules.map((schedule,index) => (
                  <div key={index}>
                      {`Month: ${schedule.month+1 } Day: ${schedule.day} Hour: ${schedule.hour} minute: ${schedule.minute}`}
                  </div>
              ))}
          </div> 
          
      </div>
  );
}
