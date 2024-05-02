const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase
const dbURL = "smart-pet-feeder-c7fd2.firebaseio.com";
initializeApp({
  credential: cert(serviceAccount),
  databaseURL: process.env.databaseURL
});

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
      res.send({ 'Message': 'Success' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send({ 'Error': 'Internal Server Error' });
    }
  }


async function handleGetUserRequest(req, res) {
    try {
        const userData = await getDocumentfromCollection("Users", "test2");
        res.send({ 'userData': userData });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ 'Error': 'Internal Server Error' });
    }
}

async function addPet(userId, petName, petType) {
  try {
    await db.collection('Users').doc(userId).collection('Pets').add({
      name: petName,
      type: petType
    });
    console.log('Pet added successfully');
  } catch (error) {
    console.error('Failed to add pet:', error);
  }
}

async function addSchedule(userId, time, amount, isActive) {
  try {
    await db.collection('Users').doc(userId).collection('Schedules').add({
      time: time,
      amount: amount,
      isActive: isActive
    });
    console.log('Schedule added successfully');
  } catch (error) {
    console.error('Failed to add schedule:', error);
  }
}
  
 module.exports = {
    handleSetDBRequest,
    handleGetUserRequest,
    addPet,
    addSchedule,

};


