const express = require("express");

const cors = require("cors");
const app = express();

const { compareDatesCB } = require('./serverUtils.js');
const {addStats,removeScheduleWithId,removeSchedule,
  getSensorValues,
  getNextSchedule,
   addSensor,
   handleSetDBRequest,
    handleGetUserRequest,
     handleAuthRequest,
      addSchedule,
      getSchedules, 
      getUserEmail, 
      addPet,
      getPets,
      deletePet,
      getStats,
      updateMail,
    } = require("./dbFunctions.js");

const {transporter} = require('./transporter.js');


//temp model
const port = 3000;
const defaultMsg = "HelloWorld";
let motorStatus = false;
let schedules = [];

let usedSchedules= []
let distanceSensorValue=null
let weightSensorValue=null

let lastEmailSend = null;


app.use(cors());
app.use(express.json());

// db tests
app.post("/testSetDB", handleSetDBRequest);
app.get("/testGetDB", handleGetUserRequest);

//auth

app.post("/login", handleAuthRequest);
app.get("/", (req, res) => {
  res.send("hello and welcome to my server");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


// FIRESTORE FUNCTIONS BELOW


app.post('/users/:userId/uploadSensorValues', async (req, res) => {
  const { userId } = req.params;
  const { dist, weight } = req.body;
  console.log("dist: ", dist);
  console.log("weight:  ", weight);
  const now = new Date();
  const userEmail = await getUserEmail(userId);


  if(dist >= 7 && lastEmailSend === null){

    const mailData = {
      from: 'smart.feeder14@gmail.com',  // sender address
      to: userEmail,   // list of receivers
      subject: 'Sending Email using Node.js',
      text: 'low food level in Conatainer!!'
      }

      transporter.sendMail(mailData, function(error, info){
        if (error) {
          console.log(error);
          res.json({message : error})
        } else {
          res.json({message : 'email send'})
        }
      });  

      lastEmailSend = new Date(); 
      
  } else if (dist >= 7 && (now.getHours() - lastEmailSend.getHours()) > 1) {
   
    console.log(" last :  ",now.getHours() - lastEmailSend.getHours());
    const mailData = {
      from: 'smart.feeder14@gmail.com',  // sender address
      to: userEmail,   // list of receivers
      subject: 'Sending Email using Node.js',
      text: 'low food level fyll now!!!'
      }

      transporter.sendMail(mailData, function(error, info){
        if (error) {
          console.log(error);
          res.json({message : error})
        } else {
          res.json({message : 'email send'})
        }
      });  

      lastEmailSend = new Date(); 
  }

  // Validation
  if (dist === undefined || weight === undefined) {
    return res.status(400).json({ error: "Invalid weight or distance data" });
  }
  try {
    await addSensor(userId, dist, weight); // upload to firestore
    res.status(201).json({ message: "Sensor data uploaded successfully." });
  } catch (error) {
    console.error(`Error uploading sensor data :`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/users/:userId/sensorValues', async (req, res) => {
  const { userId } = req.params;
  try {
    const sensorValues = await getSensorValues(userId);
    res.json(sensorValues);
  } catch (error) {
    console.error('Failed to retrieve sensor values:', error);
    res.status(500).send({ 'Error': 'Internal Server Error' });
  }
});


// Add schedule endpoint
app.post('/users/:userId/schedules', async (req, res) => {
  const { userId } = req.params;
  const {year,month, day,hour,minute,amount,pet } = req.body;

   // Validation to check if date is in the past
   const now = new Date(); 
   const scheduleDate = new Date(now); 
   scheduleDate.setYear(year);
   scheduleDate.setMonth(month);
   scheduleDate.setDate(day);
   scheduleDate.setHours(hour);
   scheduleDate.setMinutes(minute);
   if (scheduleDate < now) {
     return res.status(400).json({ message: "Cannot add a schedule in the past.", status: 400});
   }
  try {
  
    await addSchedule(userId,day,hour,month,minute,pet,amount);
    res.status(201).send({ message: 'Schedule added successfully', userId: userId , status: 201 });
  } catch (error) {
    console.error('Failed to add schedule:', error);
    res.status(500).send({ 'Error': 'Internal Server Error' });
  }
});


app.get('/users/:userId/schedules', async (req, res) => {
  const { userId } = req.params; 
  if (!userId) {
    return res.status(400).send({ error: 'Missing userId parameter' });
  }
  try {
    const schedules = await getSchedules(userId);
  
    const formattedSchedules = schedules.map(schedule => ({
      date: `${(schedule.month + 1).toString().padStart(2, '0')}.${schedule.day.toString().padStart(2, '0')}`,
      time: `${schedule.hour.toString().padStart(2, '0')}:${schedule.minute.toString().padStart(2, '0')}`,
      pet: schedule.pet, 
      amount: schedule.amount 
    }));
    res.json(formattedSchedules);
  } catch (error) {
    console.error('Failed to retrieve schedules:', error);
    res.status(500).send({ 'Error': 'Internal Server Error' });
  }
});

app.delete('/users/:userId/schedules', async (req, res) => {
  const { userId } = req.params;
  const { date, time, pet, amount } = req.body;
  // Extract date and time to be correctly ormated before interacting with the database
  let [month, day] = date.split('.');
  let [hour, minute] = time.split(':');
  month=month-1
  day = parseInt(day);
  hour = parseInt(hour);
  minute = parseInt(minute);
  try {
    const result = await removeSchedule(userId, { day, hour, month, minute, pet, amount });
    if (result) {
      res.status(200).json({ message: "Schedule removed successfully" });
    } else {
      res.status(404).json({ message: "No matching schedule found" });
    }
  } catch (error) {
    console.error('Error removing schedule:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});

app.post('/users/:userId/removeSchedule', async (req, res) => {
  const { userId } = req.params;
  const {id} = req.body;


  try {
    const result = await removeScheduleWithId(userId, { id });
    if (result) {
      res.status(200).json({ message: "Schedule removed successfully" });
    } else {
      res.status(404).json({ message: "No matching schedule found" });
    }
  } catch (error) {
    console.error('Error removing schedule:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/users/:userId/next-schedule', async (req, res) => {
  const { userId } = req.params;
  
  if (!userId) {
    return res.status(400).send({ error: 'Missing userId parameter' });
  }
  try {
    const nextSchedule = await getNextSchedule(userId);
    
    res.json(nextSchedule);
  } 
     catch (error) {
    console.error('Failed to retrieve and move next schedule:', error);
    res.status(500).send({ 'Error': 'Internal Server Error' });
  }
});



// Add pet endpoint
app.post('/users/:userId/pets', async (req, res) => {
  const { userId } = req.params;
  const { petName, petType, petAmount} = req.body;

  try {
    await addPet(userId, petName, petType, petAmount);
    res.status(201).send({message : 'Pet added successfully'});
  } catch (error) {
    console.error('Failed to add pet:', error);
    res.status(500).send({ 'Error': 'Internal Server Error' });
  }
});

app.get('/users/:userId/pets', async (req, res) => {
  const { userId } = req.params;
  try {
    const pets = await getPets(userId);

    res.json(pets);
  } catch (error) {
    console.error('Failed to retrieve pets:', error);
    res.status(500).send({ 'Error': 'Internal Server Error' });
  }
});


app.delete('/users/:userId/pets', async(req, res) => {
  const {userId} = req.params;
  const {name, type, amount} =  req.body;

  const result = await deletePet(userId, {name, type, amount});
  try{
  if (result) {
    res.status(200).json({ message: "pet removed successfully" });
  } else {
    res.status(404).json({ message: "No matching pet found" });

  }
} catch (error) {
  console.error('Error removing pet:', error);
  res.status(500).json({ error: "Internal Server Error" });
}
});


app.post('/users/:userId/stats', async (req, res) => {

  const { userId } = req.params;
  const { distance, weight } = req.body;

  try {

    await addStats(userId, distance, weight);
    res.status(201).send({ message: 'Stats added successfully' });
  } catch (error) {
    console.error('Failed to add stats:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.get('/users/:userId/stats', async (req, res) => {

  const { userId } = req.params;

  try {
    const stats = await getStats(userId);
    res.json(stats);
  } catch (error) {
    console.error('Failed to retrieve statuses:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.post('/users/:userId/stats', async (req, res) => {

  const { userId } = req.params;
  const { distance, weight } = req.body;

  try {
    await addStats(userId, distance, weight);
    res.status(201).send({ message: 'Stats added successfully' });
  } catch (error) {
    console.error('Failed to add stats:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.get('/users/:userId/stats', async (req, res) => {

  const { userId } = req.params;

  try {
    const stats = await getStats(userId);
    res.json(stats);
  } catch (error) {
    console.error('Failed to retrieve statuses:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});



// endpoint for update email and get email.
app.post('/users/:userId/updatemail', async (req, res) =>{
  const { userId } = req.params;
  const {email} = req.body;
try{
  const result = await updateMail(userId, {email});
  
  res.status(200).json({ message: " email add successfully", status : 200 });
} catch (error) {
  console.error('Error update mail: ', error);
  res.status(500).json({ error: "Internal Server Error", status : 500 });
}
})


app.get('/users/:userId/email', async (req, res) => {
  const { userId } = req.params;
try{
  const email = await getUserEmail(userId);
  res.json(email);
} catch(error){
  console.error('Failed to retrieve email:', error);
  res.status(500).send({ 'Error': 'Internal Server Error' });
}
});

