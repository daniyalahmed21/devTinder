const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "shhhhh";

//verify the jwt and attach user in request after finding in the db
const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.Token;
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).send("User not found.");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = { userAuth };
