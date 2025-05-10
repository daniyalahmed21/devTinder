const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");

// get all pending connection req for the logged in user
userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const LoggedInUser = req.user;

    const pendingRequests = await connectionRequest
      .find({
        toUserId: LoggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", ["firstName"]);

    res.json({
      message: "Data fetched successfully",
      Data: pendingRequests,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const connections = await connectionRequest.find({
        $or : 
        [{toUserId:userId ,status : "accepted"},
        {fromUserId:userId ,status : "accepted"}]
    }).populate("fromUserId",["firstName","lastName"])
    .populate("toUserId",["firstName","lastName"])

    const formattedConnections = connections.map(conn=>{
        const isSender = conn.fromUserId._id.toString() === userId.toString()
        const otherUser = isSender ? conn.toUserId : conn.fromUserId
        return{
            connectionId : conn._id,
            connectionWith : otherUser
        }
    })


    res.status(200).json({
      message: "Connections fetched successfully",
      data: formattedConnections,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = { userRouter };
