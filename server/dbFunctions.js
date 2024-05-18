const { compareDatesCB } = require('./serverUtils.js');
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore,  doc, getDoc, setDoc} = require("firebase-admin/firestore");
const {

  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
} = require("firebase-admin/auth");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase
const dbURL = "smart-pet-feeder-c7fd2.firebaseio.com";
//TODO hide URL
const firebaseApp = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: dbURL,
});

async function handleAuthRequest(req, res) {
  const token = req.body.token;
  console.log("Received token:", token);
  console.log("\n");
  
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    const uid = decodedToken.uid;
    console.log(uid + " has logged in");
    console.log("user email: ", decodedToken.email);
    const userEmail = decodedToken.email;
    const docRef = db.collection('Users').doc(uid);

    try {
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        const data = docSnap.data();
        if ('email' in data) {
          console.log("Email field exists:", data.email);
        } else {
          await docRef.set({ email: userEmail }, { merge: true });
          console.log('User email added successfully');
        }
      } else {
        // If the document does not exist, create it
        await docRef.set({ email: userEmail });
        console.log('User document created with email');
      }
    } catch (error) {
      console.error('Failed to read or write email field:', error);
    }
    res.json({ valid: true, message: "Received token successfully" });
  } catch (error) {
    console.error("Authentication failed:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);

    res.status(500).json({ valid: false, message: "Authentication failed" });
  }
}

async function getUserEmail(uid) {
  try {
    const userDoc = await db.collection('Users').doc(uid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      const email = userData.email; // Assuming 'email' is the field name where the email is stored
      return email;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
}

const db = getFirestore();


async function addDocumentToCollection(collection, doc, data) {
  return db.collection(collection).doc(doc).set(data);
}


async function getDocumentfromCollection(collection, doc) {
  const docRef = db.collection(collection).doc(doc);
  const docSnapshot = await docRef.get();

  if (docSnapshot.exists) {
    return docSnapshot.data();
  } else {
    throw new Error("Document does not exist");
  }
}

async function handleSetDBRequest(req, res) {
  try {
    await addDocumentToCollection("Users", "test2", req.body);
    res.send({ Message: "Success" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ Error: "Internal Server Error" });
  }
}

async function handleGetUserRequest(req, res) {
  try {
    const userData = await getDocumentfromCollection("Users", "test2");
    res.send({ userData: userData });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ Error: "Internal Server Error" });
  }
}

async function addSensor(userId, dist, weight) {
  try {
    await db.collection('Users').doc(userId).collection('Sensor').doc('currentValues').set({
      dist: dist,
      weight: weight
    }, { merge: true });

    
  } catch (error) {
    console.error('Failed to update sensor values:', error);
  }
}
async function getSensorValues(userId) {
  try {
 
    const sensor = db.collection('Users').doc(userId).collection('Sensor').doc('currentValues');
    const docSnapshot = await sensor.get();
    
    if (docSnapshot.exists) {
      return { id: docSnapshot.id, userId: userId, ...docSnapshot.data() };
    } else {
      console.log('No current sensor values found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching sensor values:', error);
    throw error; 
  }
}



async function addSchedule(userId,day,hour,month,minute,pet,amount) {
  
  try {
    await db.collection('Users').doc(userId).collection('Schedules').add({
      month: month,
      day: day,
      hour: hour,
      minute: minute,
      pet: pet,
      amount: amount
    });
    console.log('Schedule added successfully');
  } catch (error) {
    console.error('Failed to add schedule:', error);
  }
}


async function getSchedules(userId) {
  try {
    const scheduleCollection = db.collection('Users').doc(userId).collection('Schedules');
    const snapshot = await scheduleCollection.get();
    const schedules = snapshot.docs.map(doc => ({
      id: doc.id,
      userId: userId,
      ...doc.data()
    }));
    schedules.sort(compareDatesCB);

    return schedules;
  } catch (error) {
    console.error('Error fetching schedules:', error);
    throw error;
  }
}


async function getNextSchedule(userId) {
  if (!userId) {
    throw new Error('Missing userId parameter');
  }
  const scheduleCollection = db.collection('Users').doc(userId).collection('Schedules');
  const snapshot = await scheduleCollection.get();
  const schedules = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const sortedSchedules = schedules.sort(compareDatesCB);
  const nextSchedule = sortedSchedules[0];
  
  if (nextSchedule) {
    
    return nextSchedule;
  } else {
    throw new Error('No upcoming schedules found');
  }
}

async function removeSchedule(userId, { day, hour, month, minute, pet, amount }) {
  const schedulesRef = db.collection('Users').doc(userId).collection('Schedules');
  const allSchedulesSnapshot = await schedulesRef.get();
  if (allSchedulesSnapshot.empty) {
    console.log('No schedules found ');
    return false;
  }
  const snapshot = await schedulesRef
      .where('day', '==', day)
      .where('hour', '==', hour)
      .where('month', '==', month)
      .where('minute', '==', minute)
      .where('pet', '==', pet)
      .where('amount', '==', amount)
      .limit(1)
      .get();

  if (snapshot.empty) {
    console.log('No matching schedules found.');
    return false;
  }
  const doc = snapshot.docs[0]; 
  await doc.ref.delete();
  console.log('Schedule removed successfully.');
  return true;
}

async function removeScheduleWithId(userId, { id }) {
  const docRef = db.collection('Users').doc(userId).collection('Schedules').doc(id);
  try {
    const doc = await docRef.get();
    if (!doc.exists) {
      console.log('No matching schedules found.');
      return false;
    }
    await docRef.delete();
    console.log('Schedule removed successfully.');
    return true;
  } catch (error) {
    console.error('Failed to remove schedule:', error);
    return false;
  }
}





async function getPets(userId) {
  try {
    const petsCollection = db.collection('Users').doc(userId).collection('Pets');
    const snapshot = await petsCollection.get();
    const pets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return pets;
  } catch (error) {
    console.error('Error fetching pets:', error);
    throw error;
  }
}

async function addPet(userId, petName, petType, petAmount) {
  try {
    await db.collection('Users').doc(userId).collection('Pets').add({
      name: petName,
      type: petType,
      amount: petAmount
    });
  } catch (error) {
    console.error('Failed to add pet:', error);
  }
}


async function deletePet(userId, {name, type, amount}){
  const petsRef = db.collection('Users').doc(userId).collection('Pets');
  const allPetsSnapshot = await petsRef.get();

  if (allPetsSnapshot.empty) {
    console.log('No pets found ');
    return false;
  }

  const snapshot = await petsRef
      .where('name', '==', name)
      .where('type', '==', type)
      .where('amount', '==', amount)
      .limit(1)
      .get();
  if (snapshot.empty) {
    console.log('No matching pet found.');
    return false;
  }
  const doc = snapshot.docs[0]; 
  await doc.ref.delete();
  return true;
}

async function updateMail(userId, {email}){
  
  try{
    await db.collection('Users').doc(userId).update({
      email: email
    })
    return true;
  } catch(error) {
    console.error('Error updating user email: ', error);

    return error;
  };

}

async function addStats(userId, distance, weight) {
  const timestamp = new Date(); 
  try {
   
    await db.collection('Users').doc(userId).collection('Stats').add({
      distance: distance, 
      weight: weight,    
      timestamp: timestamp 
    });
    console.log('Status added successfully');
  } catch (error) {
    console.error('Failed to add status:', error);
  }
}

async function getStats(userId) {
  const statusRef = db.collection('Users').doc(userId).collection('Stats');
  const snapshot = await statusRef.orderBy('timestamp', 'asc').get();
  if (snapshot.empty) {
    console.log('No statuses found');
    return [];
  }
  const statuses = [];
  snapshot.forEach(doc => {
    statuses.push({ id: doc.id, ...doc.data() });
  });
  return statuses;
}

async function addDevice(userId, ipAddress) {
  try {
    await db.collection('Users').doc(userId).set({
      device: ipAddress
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Failed to add device:', error);
    return false;
  }
}

// Function to get devices for a user
async function getDevice(userId) {
  try {
    const userData = await db.collection('Users').doc(userId).get();
    
    if (userData.exists) {
      const data = userData.data();
      if('device' in data){
        console.log("device exist:", data.device);
        return true;
      }
      console.log('No devices found');
      return false;
    }

    console.log('No data found');
    return false;
  } catch (error) {
    console.error('Failed to get devices:', error);
    return false;
  }
}



module.exports = {
  removeSchedule,
  addPet,
  addSchedule,
  handleAuthRequest,
  handleSetDBRequest,
  handleGetUserRequest,
  getPets,
  getSchedules,  
  addSensor,
  getSensorValues,
  getNextSchedule,
  removeScheduleWithId,
  getUserEmail,
  deletePet,
  addStats,
  getStats,
  updateMail,
  addDevice,
  getDevice,
};


