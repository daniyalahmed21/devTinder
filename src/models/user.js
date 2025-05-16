const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
const validator = require("validator");
var jwt = require("jsonwebtoken");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      default: "John",
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    emailId: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Enter a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    age: {
      type: Number,
      min: [10, "Minimum age is 10"],
      max: [100, "Maximum age is 100"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: "Gender must be male, female, or others",
      },
    },
    image: {
      type: String,
      default: "https://i0.wp.com/e-quester.com/wp-content/uploads/2021/11/placeholder-image-person-jpg-1.jpg?fit=820%2C678&ssl=1", // URL or base64 string
    },
    about: {
      type: String,
      maxlength: [500, "About section cannot exceed 500 characters"],
    },
    skills: {
      type: [String], // Array of skill names
      default: [],
    }
  },
  {
    timestamps: true,
  }
);

// JWT method
userSchema.methods.getJWT = function () {
  const user = this;
  var token = jwt.sign({ id: user._id }, "shhhhh");
  return token;
};

// Password validation method
userSchema.methods.validatePassword = function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  return bcrypt.compare(passwordInputByUser, passwordHash);
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
