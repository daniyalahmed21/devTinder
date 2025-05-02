const adminAuth = (req, res, next) => {
  const Token = "xyz";
  const Authorized = Token === "xyz";
  if (!Authorized) {
    res.status(401).send("Admin Not Authorized");
  } else {
    console.log("admin authenticated")
    next();
  }
};

const userAuth = (req, res, next) => {
    const Token = "xyz";
    const Authorized = Token === "xyz";
    if (!Authorized) {
      res.status(401).send("User Not Authorized");
    } else {
    console.log("user authenticated")

      next();
    }
  };
  

  module.exports = {
    adminAuth,
    userAuth
  }