const mongoose = require("mongoose");
const url =
  "mongodb+srv://namastedev:JKQVCqKNSN4pWfIu@namastenode.w51pxfz.mongodb.net/devSocial";

const connectDB = async () => {
  await mongoose.connect(url);
};

module.exports = connectDB;
