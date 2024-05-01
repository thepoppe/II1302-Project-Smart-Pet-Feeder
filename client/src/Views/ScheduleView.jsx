import React, { useState,useEffect } from 'react';
import { sendData, getSchedules } from '../expressFunction';
import "./schedulePage.css"




export default function ScheduleView(props) {

  const [datetime, setDatetime] = useState('');
  const [schedules, setSchedules]= useState([])

  const [pet, setPet] = useState("");
  const [amount, setAmount] = useState("");

  // Event handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Process the form data (e.g., submit to server)
    console.log("Form submitted:", { datetime, pet, amount });
    sendData(datetime);
  };
  /* example of schedule*/
  const scheduless = [
    { date: '2024-05-01', time: '09:00', pet: 'Dog', amount: 200 },
    { date: '2024-05-02', time: '11:30', pet: 'Cat', amount: 100 },
  ];

  useEffect(() => { getSchedules() },[]);



  return (
      <div className='scheduleContainer'>
        <div className='form-container'>
        <form className="form"  onSubmit={handleSubmit}>
            <h2>Add new Schedule:</h2>
      <div className="form-group">
        <div> select date & time:</div>
        <input
              type="datetime-local"
              value={datetime}
              onChange={e => setDatetime(e.target.value)}
              required
          />
      </div>
      <div className="form-group">
        <div>Pet:</div>
        <select value={pet} onChange={(e) => setPet(e.target.value)} required>
          <option value="">Select a pet</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="bird">Bird</option>
        </select>
      </div>
      <div className="form-group">
        <div>Amount:</div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <button type="submit" className='submit-btn'>Submit</button>
    </form>
    </div>
    <div className="schedule-list-container"> 
         <h2>Your Schedule:</h2>
         <table className="schedule-table">
            <thead>
                <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Pet</th>
                <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                {scheduless.map((schedule, index) => (
                <tr key={index}>
                    <td>{`${schedule.date} `}</td>
                    <td>{schedule.time}</td>
                    <td>{schedule.pet}</td>
                    <td>{schedule.amount} gram</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        <div className='manual'>
          <h2> Manual feeding</h2>
          </div>
      </div>
  );
}
