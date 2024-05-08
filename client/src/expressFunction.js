

export default function resolvePromise(promise, promiseState) {
  
  promiseState.promise = promise;
  promiseState.data = null;
  promiseState.error = null;

  if (!promise) {
    return;
  }

  promise.then(successACB, rejectACB).catch(failureACB);

  function successACB(data) {
    if (promiseState.promise === promise) {
      promiseState.data = data;
    }
  }
  function failureACB(error) {
    if (promiseState.promise === promise) {
      promiseState.error = error;
    }
  }
  function rejectACB(error) {
    if (promiseState.promise === promise) {
      promiseState.error = error;
    }
  }
}



export function getSchedules() {
  const userId = localStorage.getItem('userId');
  return fetch(`http://localhost:3000/users/${userId}/schedules`, {
    method: 'GET',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log("getschedules");
      console.log(data);
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error; // Rethrow the error to propagate it further
    });
}

export function sendData(datetime, pet, amount){
  const userId = localStorage.getItem('userId');

  const date = new Date(datetime);
  const year = date.getFullYear();
  const month= date.getMonth();
  const day=date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();


  return  fetch(`http://localhost:3000/users/${userId}/schedules`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({month, day, hour, pet, amount, minute })  
  })
  .then(response => response.json())
  .then(data => {   
         console.log(data)  
  })
  .catch(error => console.error('Error:', error));
};

export function addPet(petName, petType, petAmount){
  const userId = localStorage.getItem('userId');
  console.log(userId);

 return fetch(`http://localhost:3000/users/${userId}/pets`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ petName, petType, petAmount})  
  })
  .then(response => response.json())
  .then(data => {   
         console.log(data)  
  })
  .catch(error => console.error('Error:', error));
};
  
export async function getPets(){
  const userId = localStorage.getItem('userId');
  console.log(userId)

  try {
    const response = await fetch(`http://localhost:3000/users/${userId}/pets`, {
      method: 'GET',
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    return console.error('Error:', error);
  }
}


