const mongoose = require("mongoose");
console.log(process.env.DB_CONNECTION_SECRET);
const url = process.env.DB_CONNECTION_SECRET;

const connectDB = async () => {
  await mongoose.connect(url);
};

module.exports = connectDB;
