import React, { useState } from 'react';


function Schedule() {
    const [datetime, setDatetime] = useState('');

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
        .then(data => console.log(data.message))
        .catch(error => console.error('Error:', error));
    };

    return (
        <div>
            <input
                type="datetime-local"
                value={datetime}
                onChange={e => setDatetime(e.target.value)}
            />
            <button onClick={sendData}>Schedule feed</button>  
        </div>
    );
}

export default Schedule;