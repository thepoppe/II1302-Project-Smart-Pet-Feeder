const express = require("express");
const cors = require("cors");
const app = express();
const { handleSetDBRequest, handleGetUserRequest, handleAuthRequest, addSchedule, getSchedules} = require("./dbFunctions.js");

//temp model
const port = 3000;
const defaultMsg = "HelloWorld";
let motorStatus=false
let schedules = [];
let usedSchedules= []
let distanceSensorValue=null


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
  const {month, day, hour, minute } = req.body;
  schedules.push({month,day, hour, minute});
  schedules.sort(compareDatesCB);
  console.log(schedules)
  res.json({ message: "Schedule added " });
});

// Endpoint to get the first schedule in the schedules array ( arduino )
app.get('/allSchedules', (req, res) => {
  res.json(schedules); 
});

// Endpoint to get all the schedule in the schedules array ( arduino )
app.get('/getschedules', (req, res) => {
  res.json(schedules[0]); 
});

// test endpoint to remove a completed schedule and add it to completed schedules
app.get('/removeSchedule', (req, res) => {
  let first=schedules.shift()
  usedSchedules.unshift(first)
  console.log(schedules)
  console.log(usedSchedules)
  res.json({ message: "Schedule removed" });
});

// Endpoint to update the current value of the distance sensor
app.post('/uploadDistanceSensorValue', (req, res) => {
  //console.log("connected")
  //console.log(req.body)
  const {value} = req.body;
  distanceSensorValue=value
  console.log(distanceSensorValue) 
  res.json({currentValue: distanceSensorValue });
});

//Endpoint to get the value of distance sensor

app.get('/distance-sensor', (req, res) => {
  res.json({ currentValue: distanceSensorValue });
});




app.get("/", (req, res) => {
  res.send(message);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});



function compareDatesCB(d1, d2){
  if(d1.month - d2.month){
    return d1.month - d2.month;
  }
  else if (d1.day-d2.day){
    return d1.day-d2.day
  }
  else if(d1.hour-d2.hour){
    return d1.hour-d2.hour
  }
  else if(d1.minute-d2.minute){
    return d1.minute-d2.minute
  }
  // Same month-day-hour-minute
  else{
    return 0
  }
}

// Add pet endpoint
app.post('/users/:userId/pets', async (req, res) => {
  const { userId } = req.params;
  const { name, type } = req.body;
  try {
    await addPet(userId, name, type);
    res.status(201).send('Pet added successfully');
  } catch (error) {
    console.error('Failed to add pet:', error);
    res.status(500).send({ 'Error': 'Internal Server Error' });
  }
});

// Add schedule endpoint
app.post('/users/:userId/schedules', async (req, res) => {
  const { userId } = req.params;
  const { time, amount, isActive } = req.body;
  try {
    await addSchedule(userId, time, amount, isActive);
    res.status(201).send('Schedule added successfully');
  } catch (error) {
    console.error('Failed to add schedule:', error);
    res.status(500).send({ 'Error': 'Internal Server Error' });
  }
});

app.get('/users/:userId/schedules', async (req, res) => {
  const { userId } = req.params;
  try {
    const schedules = await getSchedules(userId);
    (userId);
    res.json(schedules);
  } catch (error) {
    console.error('Failed to retrieve schedules:', error);
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


