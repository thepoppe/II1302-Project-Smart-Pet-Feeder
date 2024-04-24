const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const defaultMsg = "HelloWorld";
let motorStatus=false
let schedules = []; //TODO make sure schedules are sorted
let usedSchedules= []
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
  const {month, day, hour, minute } = req.body;
  const completed=false
  schedules.push({month,day, hour, minute,completed});
  schedules.sort(compareDatesCB);
  console.log(schedules) 
  res.json({ message: "Schedule added " });
});

// Endpoint to get all schedules in the schedules array
app.get('/getschedules', (req, res) => {
  res.json(schedules[0]); 
});

// test endpoint to remove a completed schedule (not used currently)

app.get('/removeSchedule', (req, res) => {
  let first=schedules.shift()
  console.log(usedSchedules)
  usedSchedules.push(first)
  console.log(usedSchedules)
  res.json({ message: "Schedule removed" });
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



function compareDatesCB(d1, d2){
  if(d1.month - d2.month){
    return d1.month - d2.month;
  }
  else if (d1.day-d2.day){
    return d1.day-d2.day
  }
  else if(d1.hour-d2.hour){
    d1.hour-d2.hour
  }
  else if(d1.minute-d2.minute){
    d1.minute-d2.minute
  }
  // Same month-day-hour-minute
  else{
    0
  }
}