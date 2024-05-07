const express = require("express");
const nodemailer = require('nodemailer');
const cors = require("cors");
const app = express();
const { handleSetDBRequest, handleGetUserRequest, handleAuthRequest, getUserEmail} = require("./dbFunctions.js");

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
  console.log(schedules)
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
  console.log(schedules)
  console.log(usedSchedules)
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