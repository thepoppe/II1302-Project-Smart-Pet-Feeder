const express = require("express");
const nodemailer = require('nodemailer');
const cors = require("cors");
const app = express();
const { compareDatesCB } = require('./serverUtils.js');
const {removeSchedule,
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
    } = require("./dbFunctions.js");

//temp model
const port = 3000;
const defaultMsg = "HelloWorld";
let motorStatus=false
let schedules = [];
let usedSchedules= []
let distanceSensorValue=null
let weightSensorValue=null



const transporter = nodemailer.createTransport({
 service:'gmail',
  auth:{
    user:'smart.feeder14@gmail.com',
    pass: 'eohn bvhe cqcj xsup'
  },
  secure: true
})

/************** end point for testing send email */
app.post("/sendmail", (req, res)=>{
  
  const mailData = {
  from: 'smart.feeder14@gmail.com',  // sender address
  to: 'ahmadmatar8@gmail.com',   // list of receivers
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
  }

  console.log("got post req")

  transporter.sendMail(mailData, function(error, info){
    if (error) {
      res.json({message : error})
    } else {
      res.json({message : 'email send'})
    }
  });
} );


app.use(cors());
app.use(express.json());

// db tests
app.post("/testSetDB", handleSetDBRequest);
app.get("/testGetDB", handleGetUserRequest);

//auth

app.post("/login", handleAuthRequest);

// Toggle motor status ( done by our application when pressing a button) 
app.post('/toggle-motor', (req, res) => {
  motorStatus = !motorStatus; //TODO make toggle motorstatus function in model
  if(motorStatus)
    res.send("Motor is running");
  else
    res.send("Motor is stopped");

});

// respond with the current value of motorStatus 
app.get('/motor-status', (req, res) => {
  res.send(motorStatus)
});


// add a new schedule to the schedule array
app.post('/schedule', (req, res) => {
  const {month, day, hour, pet, amount, minute} = req.body;
  
  // Validation to check if date is in the past
  const now = new Date(); 
  const scheduleDate = new Date(now); 
  scheduleDate.setMonth(month);
  scheduleDate.setDate(day);
  scheduleDate.setHours(hour);
  scheduleDate.setMinutes(minute);
  if (scheduleDate < now) {
    return res.status(400).json({ message: "Cannot add a schedule in the past." });
  }
  

 // Validation done. Add to schedules
  schedules.push({month,day, hour, minute});
  schedules.sort(compareDatesCB);
 
  res.json({ success: true, message: "Schedule added " });
});

// Endpoint to get the all schedules in the schedules array (frontend)
//TODO Fix pet amount
app.get('/allSchedules', (req, res) => {
  const schdles = schedules.map(schedule => ({
    date: `${(schedule.month + 1).toString().padStart(2, '0')}.${schedule.day.toString().padStart(2, '0')}`,
    time: `${schedule.hour.toString().padStart(2, '0')}:${schedule.minute.toString().padStart(2, '0')}`,
    pet: "placeholder pet",
    amount: "placeholder amount"
  }));
  //console.log(schdles)
  res.json(schdles);
});

// Endpoint to get the first value in the schedules array ( arduino )
app.get('/getschedules', (req, res) => {
  res.json(schedules[0]); 
});

// test endpoint to remove a completed schedule and add it to completed schedules
app.get('/removeSchedule', (req, res) => {
  let first=schedules.shift()
  usedSchedules.unshift(first)
  res.json({ message: "Schedule removed" });
});

const uid = 'mxnYVKim7FT3IKdeuertuI2si6r2';
// Endpoint to update the current value of the distance sensor



app.post('/uploadDistanceSensorValue', async (req, res) => {
  const {dist, weight} = req.body;
  distanceSensorValue = dist;
  weightSensorValue = weight;
  console.log("distance", distanceSensorValue); 
  console.log("wieght", weightSensorValue);
  console.log("uid ",uid);

  
 const userEmail = await getUserEmail(uid);
  

  console.log("email", userEmail)
  if(distanceSensorValue < 20){
   
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

      
  }
  res.json({ distance: distanceSensorValue, weight: weightSensorValue });
});

//Endpoint to get the value of distance sensor

app.get('/sensor-values', (req, res) => {
  res.json({ distance: distanceSensorValue, weight: weightSensorValue });
});




app.get("/", (req, res) => {
  res.send(message);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});



// FIRESTORE FUNCTIONS BELOW


app.post('/users/:userId/uploadSensorValues', async (req, res) => {
  const { userId } = req.params;
  const { dist, weight } = req.body;
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
  const {month, day,hour,minute,amount,pet } = req.body;
  try {
  
    await addSchedule(userId,day,hour,month,minute,pet,amount);
    res.status(201).send({ message: 'Schedule added successfully', userId: userId });
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

  console.log("date is", date)

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
  console.log("body: ", req.body);
  console.log("name", petName)
  console.log("type", petType)
  console.log("amount", petAmount)
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
    console.log(pets);
    res.json(pets);
  } catch (error) {
    console.error('Failed to retrieve pets:', error);
    res.status(500).send({ 'Error': 'Internal Server Error' });
  }
});


app.delete('/users/:userId/pets', async(req, res) => {
  const {userId} = req.params;
  const {name, type, amount} =  req.body;

  console.log("name", name)


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


