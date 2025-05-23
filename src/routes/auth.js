const express =require("express")
const {User}  = require("../models/user");
const {validateSignupInput} = require("../utils/validation")
const bcrypt = require("bcryptjs")

const authRouter = express.Router()

authRouter.post("/signup", async (req, res) => {
  try {
    const error = validateSignupInput(req.body);
    if (error) return res.status(400).send(error);

    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      image,
      about,
      skills,
    } = req.body;

    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(409).send("User with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      age,
      gender,
      image,
      about,
      skills, 
    });

    await user.save();
    res.status(201).send("User added successfully!");
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).send("Internal server error.");
  }
});

authRouter.post("/login", async (req, res) => {
  
    try {
      const { emailId, password } = req.body;
  
      // Check if both fields are provided
      if (!emailId || !password) {
        return res.status(400).send("Email and password are required.");
      }
  
      // Check if user exists
      const user = await User.findOne({ emailId });
      if (!user) {
        return res.status(401).send("Invalid credentials.");
      }
  
      // Compare hashed password
      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        return res.status(401).send("Invalid credentials.");
      }
  
      // Generate and set JWT
      const token = user.getJWT(); // user schema methods
      res.cookie("Token", token);
      console.log(user)
  
      res.send(user);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).send("Internal server error.");
    }
});

authRouter.post("/logout", async(req, res) => {
  res.clearCookie("Token", {
    httpOnly: true,
    secure: true, // use only if you're on HTTPS
    sameSite: "strict",
  });
  res.send("Logout Successful!!");
});

module.exports = {
    authRouter
}