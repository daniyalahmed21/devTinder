const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const app = express();
const { connectDb } = require("./config/database");

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

// Normal route
app.get("/", (req, res) => {
  res.send("home");
});

app.use("/admin", adminAuth);

app.use("/user", userAuth);

app.get("/user/login", (req, res) => {
  // throw new Error("something went wrong"); // will trigger error handler
  console.log("user logged in");
  res.send("login");
});

app.get("/user/getAllData", adminAuth, (req, res) => {
  res.send("User data sent");
});

app.get("/admin/getAllData", adminAuth, (req, res) => {
  res.send("Admin data sent");
});

// Error handling middleware — must be last
app.use((err, req, res, next) => {
  res.status(500).send("something went wrong");
});
