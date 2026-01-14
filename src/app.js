const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);
  //Creating a new instance of User Model
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added successfully!");
  } catch (err) {
    res.status(400).send("User could not be created: " + err.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("User could not be found");
    }
    res.send(user);
  } catch (err) {
    res.status(404).send("User could not be found");
  }
});

app.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  try {
    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
      res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(404).send("User not found");
  }
});
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(404).send("User not found");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const userObj = req.body;

  try {
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "photoUrl",
      "about",
      "gender",
      "skills",
      "password",
    ];

    const isUpdateAllowed = Object.keys(userObj).every((userKey) =>
      ALLOWED_UPDATES.includes(userKey)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    const user = await User.findByIdAndUpdate(userId, userObj, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send(user);
  } catch (err) {
    res.status(404).send(`Update Failed: ${err.message}`);
  }
});
app.delete("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send(`${userId} deleted`);
  } catch (err) {
    res.status(404).send("User not found");
  }
});

connectDB()
  .then(() => {
    console.log("Database connection establised..");
    app.listen(3000, () => console.log("Listening to 3000...."));
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });
