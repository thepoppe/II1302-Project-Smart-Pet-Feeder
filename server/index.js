const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const defaultMsg = "HelloWorld";
let motorStatus=false

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

app.get("/", (req, res) => {
  res.send(message);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
