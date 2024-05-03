import React, { useState } from 'react';
import { addNewPet, getPets, sendEmail, getEmail,  } from '../expressFunction';

export default function SettingsView() {
  const [pets, setPets] = useState([]); //store the list of pets
  const [AddPetForm, setAddForm] = useState(false); //shows on requests
  const [newPet, setNewPet] = useState({
    name: '',
    amount:'',    
  });
  const [petName, setPetName] = useState(''); 
  const [amount, setAmount] = useState(''); 
  const [userSettings, setUserSettings] = useState({ name: '', email:'' });

  const [email, setEmail] = useState('');


  const handleAddPetSubmit = (event) => {
    event.preventDefault();
    setNewPet({ name: petName, amount :amount }); 
 
    addNewPet(newPet).then(()=>{ })
    
  };

  const handleDeletePet = (petIndex) => {
    const updatedPets = pets.filter((_, index) => index !== petIndex);
    setPets(updatedPets);
  };



  const handleSaveSettings = (event) => {
    event.preventDefault();
    /**TO DO impelement function i expressFunction.js */
    sendEmail(email); 
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
            <div className="form-group">
            <div htmlFor="pet-amount">Amount of food (grams):</div>
            <input
              type="number"
              value={amount}
              onChange={(e)=> setAmount(e.target.value)}
              required
            />
          </div>           
            <button className='submit-btn' type="submit" >Add Pet</button>
          </form>
        </div>
        
      </div>
      <div className='settingPageItems'>
      <h2>My Pets</h2>
      <ul className="homeUL">
        {pets.map((pet, index) => (
          <li className="pet-item homeLI" key={index}>
            <span>{pet.name}</span>
            
            <span>{pet.amount}</span>
            <button className="delete-button" onClick={() => handleDeletePet(index)}>X</button>
          </li>
          
        ))}
      </ul>
      </div>
      <div className='settingPageItems setting-grid'>
      <h2>My Settings</h2>
      <div className="settings-container">
        <div>
         Add your e-mail for notification:  
        </div>
        <div>
          <label >Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
          />
        </div>

        <button className="centered-button" onClick={handleSaveSettings}>Save Settings</button>
      </div>
      </div>
    </div>
  );
}