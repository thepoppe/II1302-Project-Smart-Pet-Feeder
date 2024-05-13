import React, { useState,useEffect } from 'react';
import { sendData, getSchedules, getPets} from '../expressFunction';
import {message} from "antd";


const ip = `${import.meta.env.VITE_SERVER_IP_ADDRESS}`;

export default function ScheduleView(props) {
  const [datetime, setDatetime] = useState("");
  const [pet, setPet] = useState("");
  const [amount, setAmount] = useState("");
  const [ManualAmount, setManualAmount] = useState("");
  const [schedules, setSchedules] = useState([]);
  const[pets, setPets] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();
 
  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'schedule added sccessfully',
      duration: 2,
    });
  };

  const manualFeed = () => {
    messageApi.open({
      type: 'success',
      content: 'Food is dipenesd',
      duration: 2,
    });
  };

  const error = () => {
    messageApi.open({
      type: 'error',
      content: 'Cannot add a schedule in the past',
      duration: 4,
    });
  };

  const errorAmount = () => {
    messageApi.open({
      type: 'error',
      content: 'Fill in the amount',
      duration: 5,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendData(datetime, pet, amount).then((data) => {
      if (data.status === 400) {
        error();
        return getSchedules();
      } else {
        // Handle other status codes if needed
        success();
        return getSchedules();
      }
    })
    .then((data) => {
      setSchedules(data);
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });}

    function sendCurrentDate() {
      const userId = localStorage.getItem('userId');
      console.log("user")
      console.log(userId)
      const now = new Date();
      const month = now.getMonth();
      const day = now.getDate();
      const hour = now.getHours();
      const minute = now.getMinutes();
      if(ManualAmount == ''){
        errorAmount();
        return;
      }
      const amount= ManualAmount;
  
      fetch(`${ip}/users/${userId}/schedules`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ month, day, hour, minute,pet,amount })
    })
    .then(response => response.json())
    .then(data => {
      getSchedules().then((data) => setSchedules(data));
    })
    .catch(error => console.error('Error:', error));
    manualFeed();
  }

  function handleDelete(index) {
    const schedule = schedules[index];
    const userId = localStorage.getItem('userId');
  
    fetch(`http://localhost:3000/users/${userId}/schedules`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: schedule.date, 
        time: schedule.time, 
        pet: schedule.pet,
        amount: schedule.amount
      })
    })
    .then(response => {
      if (response.ok) {
        return getSchedules(); 
      } else {
        throw new Error('Failed to delete the schedule');
      }
    })
    .then(data => {
      setSchedules(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
  useEffect(() => {
    getSchedules()
        .then((data) => setSchedules(data))
        .catch((error) => {
            console.error('Error fetching schedules:', error);
        });
    getPets()
        .then((data) => setPets(data))
        .catch((error) => {
            console.error('Error fetching pets:', error);
        });
}, []);

  return (
    <div className="scheduleContainer">
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
          <h2>Add new Schedule:</h2>
          <div className="form-group">
            <div> select date & time:</div>
            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              required

          />
      </div>
      <div className="form-group">
        <div>Pet:</div>
    <select value={pet}  onChange={(e) => {
      const selectedPet = pets.find((p) => p.name === e.target.value);
      setPet(selectedPet.name);
      setAmount(selectedPet.amount);
    }}>
    <option value="">Select a pet</option>
      {pets.map((pet, index) => (
        <option key={index} value={pet.name}>{pet.name}</option>
      ))}
    </select>
      </div>
      <div className="form-group">
        <div>Amount:</div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step={10} /* increas value by 10*/ 
          min={10}
          max={200}
          required
        />
      </div>
      <button type="submit" className='submit-btn'>Submit</button>
    </form>
    </div>
    {contextHolder}
    <div className="schedule-list-container"> 
         <h2>Your Schedule:</h2>
         <div class="schedule-table-container">
         <table className="schedule-table">

            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Pet</th>
                <th>Amount</th>
                <th className="header-cell">Action</th>{" "}
                {/* New column for the delete button */}
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule, index) => {
                return (
                  <tr key={index}>
                    <td>{`${schedule.date}`}</td>
                    <td>{schedule.time}</td>
                    <td>{schedule.pet}</td>
                    <td>{schedule.amount} gram</td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(index)}
                      >
                        X
                      </button>
                    </td>{" "}
                    {/* Delete button */}
                  </tr>
                );
              })}
            </tbody>
            </table>
            </div>
        </div>
        <div className='manual'>
          <h2> Manual feeding</h2>
          <div className="manualItem">
            <div >
        <label>Amount:</label>
        <input
          type="number"
          value={ManualAmount}
          onChange={(e) => setManualAmount(e.target.value)}
          step={10}
          min={10}
          max={200}
        />
        </div>
        <button className='feedButton' onClick={sendCurrentDate}>Feed now!</button>
      </div>
      <div className="manual">
        <h2> Manual feeding</h2>
        <div className="manualItem">
          <div>
            <label>Amount:</label>
            <input
              type="number"
              value={ManualAmount}
              onChange={(e) => setManualAmount(e.target.value)}
              step={10}
              min={10}
              max={200}
              required
            />
          </div>
          <button className="feedButton" onClick={sendCurrentDate}>
            Feed now!
          </button>
          <span>Food has been dispensed successfully</span>
        </div>
      </div>
    </div>
    </div>
  );
}
