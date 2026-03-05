const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");
const ConnectionRequest = require("../models/connetionRequest");
const router = express.Router();

router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const toUser = await User.find({ _id: toUserId });

    if (!toUser[0]) {
      throw new Error("User not found!");
    }

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).send("invalid status type: " + status);
    }

    const connectionRequestExists = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      ],
    });

    if (connectionRequestExists) {
      throw new Error("Connection Request already exist");
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const connectionData = await connectionRequest.save();

    const emailRes = await sendEmail.run(
      "Connection request from " + req.user.firstName,
      req.user.firstName + " sends " + status + " to " + toUser[0].firstName,
    );

    res.status(200).json({
      message:
        req.user.firstName + " sends " + status + " to " + toUser[0].firstName,
      data: connectionData,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
});

router.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed!" });
      }

      //Make sure the status is interested
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request not found" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  },
);

module.exports = router;
