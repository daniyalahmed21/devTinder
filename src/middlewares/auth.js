const { User } = require("../models/user");
var jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const Token = req.cookies.Token;
    const decoded = await jwt.verify(Token, "shhhhh");
    const user = await User.findOne({_id:decoded.id});
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user
    next();
  } catch (err) {
    res.status(400).send("Err: " + err.message);
  }
};

module.exports = {
  userAuth,
};
