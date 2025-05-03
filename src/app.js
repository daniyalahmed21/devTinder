const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const app = express();
const { connectDb } = require("./config/database");
const { User } = require("./models/user");
const bcrypt  = require("bcryptjs");

// Middleware to parse JSON will run for all request convert json to js obj and assign it to body
app.use(express.json());

//find user by email
app.get("/feed", async (req, res) => {
  const emailId = req.body.emailId;
  const users = await User.findOne({ emailId });
  if (users) {
    console.log(users.emailId);
    res.send(users.emailId);
  } else {
    res.status(400).send("User not found!");
  }
});

//delete a user
app.delete("/user", async (req, res) => {
  try {
    const id = req.body.Id;
    await User.findByIdAndDelete(id);
    res.send("User Deleted !");
  } catch (err) {
    console.error(err);
    res.send("something went wrong");
  }
});

//update a user
app.patch("/user", async (req, res) => {
  const userId = req.body.Id;
  const Data = req.body;
  try {
    await User.findByIdAndUpdate(userId, Data, {
      runValidators: true,
    });
    res.send("User updated !");
  } catch (err) {
    console.error("Update Failed " + err.message);
    res.status(400).send("something went wrong");
  }
});

app.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    firstName,
    lastName,
    emailId,
    password: hashedPassword,
  });

  await user.save();
  res.send("User added successfully!");
});

app.post("/login",async(req,res)=>{
  const { emailId, password } = req.body;

  const user = await User.findOne({emailId})
  console.log(user)

  if(!user){
    throw new Error("invalid credentials")
  }
  const isPasswordValid = await bcrypt.compare(password,user.password)

  if(!isPasswordValid){
    throw new Error("invalid credentials")
  }
  else{
    res.send("Login success")
  }
})
connectDb()
  .then(() => {
    console.log("connection established successfully");
    app.listen(3000, () => {
      console.log("Server is successfully listening at port 3000");
    });
  })
  .catch(() => {
    console.error("Database cannot be connected!");
  });
