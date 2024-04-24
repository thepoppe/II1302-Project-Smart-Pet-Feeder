const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const defaultMsg = "HelloWorld";
let motorStatus=false
let schedules = [];
let distanceSensorValue=null

app.use(cors());
app.use(express.json());

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
  const {day, hour, minute } = req.body;
  const completed=false
  schedules.push({day, hour, minute,completed});
  console.log(schedules) 
  res.json({ message: "Schedule added " });
});

// Endpoint to get all schedules in the schedules array
app.get('/getschedules', (req, res) => {
  res.json(schedules[0]); 
});

// Endpoint to update the current value of the distance sensor
app.post('/uploadDistanceSensorValue', (req, res) => {
  console.log("connected")
  console.log(req.body)
  const {value} = req.body;
  distanceSensorValue=value
  console.log(distanceSensorValue) 
  res.json({currentValue: distanceSensorValue });
});


app.get("/", (req, res) => {
  res.send(message);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
