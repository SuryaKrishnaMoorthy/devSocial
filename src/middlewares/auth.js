const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    //Read the token from cookies
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Invalid Token.Please Login");
    }
    //Validate the token
    const decodedObj = jwt.verify(token, "DEV@Social$2025", {
      expiresIn: "1d",
    });
    const { _id } = decodedObj;
    console.log(decodedObj);
    //Find the user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("Invalid User");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error from auth.js: " + err.message);
  }
};

module.exports = {
  userAuth,
};
