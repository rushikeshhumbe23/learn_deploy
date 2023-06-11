const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { UserModel } = require("../model/user.model");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { name, email, pass } = req.body;
  try {
    bcrypt.hash(pass, 5, async (err, hash) => {
      if (err) {
        res.json({ error: err.message });
      } else {
        const user = new UserModel({ name, email, pass: hash });
        await user.save();
      }
      res.json({
        mgs: "new user has been Registered successfully",
        user: req.body,
      });
    });
  } catch (error) {
    res.json({ error: err.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(pass, user.pass, (err, result) => {
        if (result) {
          let token = jwt.sign(
            { userID: user._id, user: user.name },
            process.env.secret
          );
          res.json({ msg: "Login Successfull", token });
        } else {
          res.json({ msg: "Wrong Cridentials" });
        }
      });
    } else {
      res.json({ msg: "User does not exist" });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = {
  userRouter,
};
