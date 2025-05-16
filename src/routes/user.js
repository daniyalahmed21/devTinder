const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const { User } = require("../models/user");

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

//get all the connections of logged in user
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const connections = await connectionRequest.find({
        $or : 
        [{toUserId:userId ,status : "accepted"},
        {fromUserId:userId ,status : "accepted"}]
    }).populate("fromUserId",["firstName","lastName","image","about"])
    .populate("toUserId",["firstName","lastName","image","about"])

    const formattedConnections = connections.map(conn=>{
        const isSender = conn.fromUserId._id.toString() === userId.toString()
        return isSender ? conn.toUserId : conn.fromUserId
        
    })


    res.status(200).json({
      message: "Connections fetched successfully",
      data: formattedConnections,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//get the feed for the user http://localhost:3000/feed?page=1&limit=1
userRouter.get("/feed", userAuth ,async(req, res)=>{
  try{

    const page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 5
    limit = limit > 30 ? 30 : limit



    const skipped = ()=>{
      return (page-1)*limit
    }

    const userId = req.user._id
    const connectionRequests = await connectionRequest.find({
      $or:[{toUserId:userId},{fromUserId:userId}]
    }).select("toUserId fromUserId")

    const excludeFromFeed = new Set()
    excludeFromFeed.add(userId.toString()); 

    connectionRequests.forEach(user=>{
      excludeFromFeed.add(user.toUserId.toString())
      excludeFromFeed.add(user.fromUserId.toString())

    })


    const feedUser = await User.find({
      _id : { $nin: Array.from(excludeFromFeed) }   //transform set into array and apply not in 
    }).select("_id firstName lastName image about skills").skip(skipped).limit(limit)

    res.send(feedUser)


  }catch(err){
    res.status(500).json({ error: err.message });
  }
})

module.exports = { userRouter };
