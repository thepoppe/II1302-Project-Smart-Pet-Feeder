const { compareDatesCB } = require('./serverUtils.js');
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
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

    try {
     await db.collection('Users').doc(uid).set({ email: userEmail });
      console.log('user added successfully');
    } catch (error) {
      console.error('Failed to add email:', error);
    }
   // const email = await getEmailFromFirestore(uid);


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

    console.log('Sensor values successfully updated');
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
    await scheduleCollection.doc(nextSchedule.id).delete();
    await db.collection('Users').doc(userId).collection('usedSchedules').doc(nextSchedule.id).set(nextSchedule);

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
    console.log('Pet added successfully');
  } catch (error) {
    console.error('Failed to add pet:', error);
  }
}


async function deletePet(userId, {name, type, amount}){
  const petsRef = db.collection('Users').doc(userId).collection('Pets');
  const allPetsSnapshot = await petsRef.get();

 console.log(name, type, amount);

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
  console.log("pet found: ", doc);
  await doc.ref.delete();
  console.log('pet removed successfully.');
  return true;
}

async function updateMail(userId, {email}){
  const userDoc = await db.collection('Users').doc(userId).get();

  if(userDoc.exists){
    const userData = userDoc.data;
    userData.email = email;
    console.log(userData.email);
    return true;
  } else {
    console.log("no such docment")
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
  getUserEmail,
  deletePet,
};


