const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const defaultMsg = "HelloWorld";
let motorStatus=false

app.use(cors());

// Toggle motor status ( done by our application when pressing a button) 
app.get('/toggle-motor', (req, res) => {
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


app.post("/reset-motor-status", (req, res) => {
  motorStatus = false; 
  res.send("Motor status has been reset");
});


app.get("/", (req, res) => {
  res.send(message);
});


app.get("/a", (req, res) => {
  const { headers, query } = req;
  const msg = query.data;
  const responseMessage = `Hello, your message: ${JSON.stringify(msg)}.`;
  res.send(responseMessage);
});




app.use(express.json());
let message = defaultMsg;

app.post("/post-var", (req, res) => {
  const { data } = req.body;
  message = data;
  res.json({ success: true, message: `Received message: ${message}` });
});

app.post("/post-reset", (req, res) => {
  message = defaultMsg;
  res.json({ success: true, message: "Msg was restored" });
});



app.get("/test", (req, res) => {
  const responseMessage = `Hello, this is a repsonse. Why is it so much`;
  console.log(`Recieving test get`);
  res.send(responseMessage);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
