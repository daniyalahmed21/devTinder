const express = require("express");
const app = express();
const { connectDb } = require("./config/database");
const cookieParser = require("cookie-parser");
const {profileRouter} = require("./routes/profile")
const {authRouter} = require("./routes/auth")
const {requestRouter} = require("./routes/request")


//global middleware
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/",authRouter)
app.use("/",profileRouter); 
app.use("/",requestRouter);


// app.use("*", (req, res) => {
//   res.status(404).send("Route not found");
// });

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
