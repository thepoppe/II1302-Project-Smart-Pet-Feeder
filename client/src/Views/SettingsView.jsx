import React, { useState } from 'react';

export default function SettingsView() {
  const [pets, setPets] = useState([]); //store the list of pets
  const [AddPetForm, setAddForm] = useState(false); //shows on requests
  const [newPet, setNewPet] = useState({
    name: '',
    amount:'',    
  });
  const [userSettings, setUserSettings] = useState({ name: '', email:'' });


  const handleNewPetChange = (event) => {
    const { name, value } = event.target;
    setNewPet((prevPet) => ({
      ...prevPet,
      [name]: value,
    }));
  };

  const handleAddPetSubmit = (event) => {
    event.preventDefault();
    setPets([...pets, newPet]);
    setNewPet({ name: '' }); 
    setAddForm(false); 
  };

  const handleDeletePet = (petIndex) => {
    const updatedPets = pets.filter((_, index) => index !== petIndex);
    setPets(updatedPets);
  };

  const handleUserSettingsChange = (event) => {
    const { name, email,  value } = event.target;
    setUserSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
      [email]: value,
    }));
  };

  const handleSaveSettings = () => {
    console.log('User settings saved:', userSettings);
  };

  return (
    <div className="container">
      {AddPetForm && (
        <div className="add-pet-form">
          <form onSubmit={handleAddPetSubmit}>
            <label htmlFor="pet-name">Pet's Name:</label>
            <input
              type="text"
              id="pet-name"
              name="name"
              value={newPet.name}
              onChange={handleNewPetChange}
              required
            /> 
            <div>
            <label htmlFor="pet-amount">Amount of food (grams):</label>
            <input
              type="number"
              id="pet-amount"
              name="amount"
              value={newPet.amount}
              onChange={handleNewPetChange}
              required
            />
          </div>           
            <button type="button" onClick={() => setAddForm(false)}>Cancel</button>
          </form>
        </div>
        
      )}
      
      <h2>My Pets</h2>
      <ul className="homeUL">
        {pets.map((pet, index) => (
          <li className="pet-item homeLI" key={index}>
            {pet.name}
            <button className="delete-button" onClick={() => handleDeletePet(index)}>X</button>
          </li>
        ))}
      </ul>

      <button className="centered-button" onClick={() => setAddForm(true)}>Add New</button>

      <h2>My Settings</h2>
      <div className="settings-container">
        <div>
          <label >Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={userSettings.name}
            onChange={handleUserSettingsChange}
          />
        </div>
        <div>
          <label >Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={userSettings.email}
            onChange={handleUserSettingsChange}
          />
        </div>

        <button className="centered-button" onClick={handleSaveSettings}>Save Settings</button>
      </div>
    </div>
  );
}