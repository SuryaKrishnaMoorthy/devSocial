const express = require("express");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    //Validate Data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    //Encrpyt the password
    const passwordHash = await bcrypt.hash(password, 10);

    //Creating a new instance of User Model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    //Add token to the cookie and send response back to the user
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    });
    res.json({ message: "User added successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { emailId, password: reqPassword } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(reqPassword);

    if (isPasswordValid) {
      //Create JWT token
      const token = await user.getJWT();

      //Add token to the cookie and send response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      });

      const { password, ...data } = user.toObject();
      res.json(data);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid Credentials" });
  }
});

router.post("/logout", async (req, res) => {
  res
    .cookie("token", "", { expires: new Date(Date.now()) })
    .send("Logout Successful");
});

module.exports = router;
