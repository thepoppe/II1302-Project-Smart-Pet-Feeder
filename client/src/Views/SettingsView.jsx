import React, { useState, useEffect } from 'react';
import {getPets, addPet, getUserEmail} from '../expressFunction';
import {message} from "antd";


export default function SettingsView() {
  const [pets, setPets] = useState([]); //store the list of pets
  const [petName, setPetName] = useState(''); 
  const [petAmount, setPetAmount] = useState(''); 
  const [petType, setPetType] = useState('');

  const [updateEmail, setUpdateEmail] = useState(true);


  const [email, setEmail] = useState('');

  const [messageApi, contextHolder] = message.useMessage();
 
  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Email is Updated',
      duration: 5,
    });
  };

  const handleAddPetSubmit = (event) => {
    event.preventDefault();
    addPet(petName, petType, petAmount).then( ()=> {
     return getPets()
    }).then((data) => {     
      setPets(data);
    }).catch((error) => {
      console.error("An error occurred:", error);
    });
    
  };




  useEffect(() => {
    getPets().then((data) => setPets(data))

    getUserEmail().then((data) => {setEmail(data)
       setUpdateEmail(false)})
    }, []);

  function deletePet(index){
    const pet = pets[index];
    const userId = localStorage.getItem('userId');

    fetch(`http://localhost:3000/users/${userId}/pets`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        name: pet.name,
        type: pet.type,
        amount: pet.amount,
       })
      
    })
    .then(response => {
      if (response.ok) {
        return getPets(); 
      } else {
        throw new Error('Failed to delete the pet');
      }
    })
    .then(data => {
      setPets(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

 const handleSaveSettings = (event) => {
      event.preventDefault();
      const userId = localStorage.getItem('userId');
      console.log(userId);
  
      return fetch(`http://localhost:3000/users/${userId}/updatemail`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })  
      })
      .then(response => response.json())
      .then(data => {   
        setUpdateEmail(false);
        success();
      })
      .catch(error => console.error('Error:', error));
    };


  return (
    <div className="SettingPageContainer">
       
      <div className='settingPageItems'>
      <h2>Add a new Pet:</h2>
        <div className="add-pet-form">
          <form  className="form" onSubmit={handleAddPetSubmit}>
            <div className="form-group">
            <div  htmlFor="pet-name">Pet's Name:</div>
            <input
              type="text"
              onChange={(e)=> setPetName(e.target.value)}
              value={petName}
              required
            /> 
            </div>
            <div>
            <div className="form-group">
            <div  htmlFor="pet-type">Pet's type:</div>
            <input
              type="text"
              onChange={(e)=> setPetType(e.target.value)}
              value={petType}
              required
            /> 
            </div>
            </div>
            <div className="form-group">
            <div htmlFor="pet-amount">Amount of food (grams):</div>
            <input
              type="number"
              value={petAmount}
              onChange={(e)=> setPetAmount(e.target.value)}
              required
            />
          </div>           
            <button className='submit-btn' type="submit" >Add Pet</button>
          </form>
        </div>
        
      </div>
      <div className='settingPageItems'>
      <h2>My Pets</h2>
      <div>
      <table className="schedule-table">
            <thead>
                <tr>
                <th>Pet</th>
                <th>Type</th>
                <th>Amount</th>
                <th className='header-cell'>Action</th> {/* New column for the delete button */}
                </tr>
            </thead>
            <tbody>
                {pets.map((pet, index) => {
                  return(
                  <tr key={index}>
                    <td>{pet.name}</td>
                    <td>{pet.type}</td>
                    <td>{pet.amount} gram</td>
                    <td>
          <button className='delete-button' onClick={() => deletePet(index)}>X</button>
        </td> 
                </tr>
                )}
                )}
            </tbody>
            </table>
      </div>
      </div>
      <div className='settingPageItems setting-grid'>
      <h2>My Settings</h2>
      <div className="settings-container">
        <div >
         Add your e-mail for notification:  
        </div>
      {contextHolder}
        {
  updateEmail ? (
    <div className='setting-gridItem'>
      <div>
        <label>Email:</label>
        <input
          type="text"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button className="submit-btn" onClick={handleSaveSettings}>Update</button>
    </div>   
  ) : (
    <div style={{ display: "flex", alignItems: "center", gap :"30px", paddingLeft: "20px", paddingTop: "30px"}}>
      <div>
    {email}
    </div>
    <div>
    <button style={{ paddingLeft: "10px" }} onClick={() => setUpdateEmail(true)}>Change</button>
    </div>
  </div>
  )
}
      </div>
      
      </div>
    </div>
  );
}