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
  addPet,
  addSchedule,
  handleAuthRequest,
  handleSetDBRequest,
  handleGetUserRequest,
  getUserEmail,
};


