const express = require("express");
const User = require("../models/user");

const route = express.Router();

route.get("/signin", (req, res) => {
  res.render("signin",{
    path: "/user/signin"
  });
});
route.get("/signup", (req, res) => {
  res.render("signup",{
    path: "/user/signup"
  });
});

route.get("/logout", (req, res) => {
  res.cookie("token").redirect("/");
});

route.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });
  res.redirect("/");
});

route.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Invalid email or password",
    });
  }
});

route.get("/profile", async (req, res) => {
  const user = await User.findById(req.user._id);
  res.render("profile", {
    user: req.user,
    path: "/user/profile",
  });
})
module.exports = route;
