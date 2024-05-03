import React, { useState,useEffect } from 'react';
import { sendData, getSchedules, toggleMotor } from '../expressFunction';




export default function ScheduleView(props) {

  const [datetime, setDatetime] = useState('');
  const [pet, setPet] = useState('');
  const [amount, setAmount] = useState('');
  const [ManualAmount, setManualAmount] = useState('');
  const [schedules, setSchedules] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", { datetime, pet, amount });
    sendData(datetime, pet, amount).then(()=>{ 
        getSchedules().then((data) => setSchedules(data));
    })   
  }
  
  useEffect(() => {
    getSchedules().then((data) => setSchedules(data))
    }, [pet]);



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
              onChange={(e) => setDatetime(e.target.value)}
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
          step={10} /* increas value by 10*/ 
          min={10}
          max={200}
          required
        />
      </div>
      <button type="submit" className='submit-btn'>Submit</button>
    </form>
    </div>
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
                <th className='header-cell'>Action</th> {/* New column for the delete button */}
                </tr>
            </thead>
            <tbody>
                {schedules.map((schedule, index) => {
                  return(
                  <tr key={index}>
                    <td>{`${schedule.date}`}</td>
                    <td>{schedule.time}</td>
                    <td>{schedule.pet}</td>
                    <td>{schedule.amount} gram</td>
                    <td>
          <button className='delete-button' onClick={() => handleDelete(index)}>X</button>
        </td> {/* Delete button */}
                </tr>
                )}
                )}
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
          required
        />
        </div>
        <button className='feedButton' onClick={(e)=>{ toggleMotor()}}>Feed now!</button>
        <span>Food has been dispensed successfully</span>
      </div>
      
          </div>
      </div>
  );
}
