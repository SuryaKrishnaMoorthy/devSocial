const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const connectDB = require("./config/database");
require("./utils/cronjob");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log("Database connection establised..");
    app.listen(3000, () => console.log(`Listening to ${port}....`));
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });
