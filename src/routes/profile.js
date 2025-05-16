const express = require("express");
const { userAuth } = require("../middlewares/auth"); // Import your auth middleware
const {User}  = require("../models/user");
const {validateEditProfileData}  =  require("../utils/validation")

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
  try {
    if (!validateEditProfileData(req)) {
      return res.status(400).send("Invalid fields in edit request");
    }

    const userId = req.user._id;
    const updatedUserData = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.send("User updated successfully!");
  } catch (error) {
    console.error("Edit error:", error.message);
    res.status(500).send("Something went wrong while updating profile");
  }
});

module.exports = { profileRouter };
