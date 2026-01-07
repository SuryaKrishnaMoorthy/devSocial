const express = require("express");

const app = express();

//request handler
app.use("/test", (req, res) => {
  res.send("Hello from the server");
});

app.use("/hello", (req, res) => {
  res.send("Another hello from the server");
});

app.listen(3000, () => console.log("Listening to 3000...."));
