const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const defaultMsg = "HelloWorld";

app.use(cors());
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
