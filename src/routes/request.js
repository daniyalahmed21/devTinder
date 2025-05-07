const express = require("express");
const { userAuth } = require("../middlewares/auth"); // Import your auth middleware

const requestRouter = express.Router();

requestRouter.get("/sendConnectionRequest", userAuth, async (req, res) => {
  res.send(`sending connection request by ${req.user.firstName}`);
});

module.exports = { requestRouter };
