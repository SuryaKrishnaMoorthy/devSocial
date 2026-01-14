const mongoose = require("mongoose");
const url =
  "mongodb+srv://namastedev:KIaHjHGVwzZK5FPq@namastenode.w51pxfz.mongodb.net/devSocial";

const connectDB = async () => {
  await mongoose.connect(url);
};

module.exports = connectDB;
