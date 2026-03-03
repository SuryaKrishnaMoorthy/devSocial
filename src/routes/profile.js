const express = require("express");
const bcrypt = require("bcrypt");

const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");
const User = require("../models/user");

const router = express.Router();
router.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid Edit Request");
    } else {
      const loggedInUser = req.user;
      Object.keys(req.body).forEach(
        (key) => (loggedInUser[key] = req.body[key]),
      );
      await loggedInUser.save();
      res
        .status(200)
        .json({ message: "Profile Updated Successfully", data: loggedInUser });
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

router.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const oldPassword = req.body.oldPassword;
    const isOldPasswordValid = await loggedInUser.validatePassword(oldPassword);
    if (!isOldPasswordValid) {
      throw new Error("Invalid Password!");
    }
    const isIdentical = await bcrypt.compare(
      req.body.newPassword,
      loggedInUser.password,
    );

    if (isIdentical) {
      throw new Error("Invalid Password!");
    }
    const newPasswordHash = await bcrypt.hash(req.body.newPassword, 10);

    loggedInUser.password = newPasswordHash;
    loggedInUser.save();
    res
      .cookie("token", null, { expires: new Date(Date.now()) })
      .send("Password changed successfully. User logged out");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = router;
