const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { User } = require("../models/user");
const requestRouter = express.Router();

const allowedStatuses = ["ignore", "interested"];

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const toUserId = req.params.toUserId;
      const fromUserId = req.user._id;
      const status = req.params.status;

      //toUser exist in db

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res
          .status(400)
          .json({ error: "A request can only be sent to registered users" });
      }

      // Validate status
      if (!allowedStatuses.includes(status)) {
        return res
          .status(400)
          .json({ error: `${status} is not a valid status` });
      }

      // Prevent sending a request to self
      if (toUserId === fromUserId.toString()) {
        return res
          .status(400)
          .json({ error: "You cannot send a request to yourself" });
      }

      // Optional: Prevent duplicate request
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (existingRequest) {
        return res
          .status(400)
          .json({ error: "A request already exists between these users" });
      }

      const connectionRequest = new ConnectionRequest({
        toUserId,
        fromUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.send("Connection request send successfully");
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error while sending connection request" });
    }
  }
);

module.exports = { requestRouter };
