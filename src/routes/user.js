const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const activated = require("../middleware/activated");
const auth = require("../middleware/auth");
const activate = require("../middleware/activate_acc");

const router = new express.Router();

// @route     POST api/users/register
// @desc      Register a user
// @access    Public
router.post("/register", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    activate(user, "activate");
    res.status(201).json({ user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

// @route     POST api/users/login
// @desc      Login a user
// @access    Public
router.post("/login", [activated], async (req, res) => {
  try {
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      req.user.password
    );

    if (!isPasswordMatch) {
      return res.status(400).json("Invalid email or password");
    }

    const token = await req.user.generateAuthToken();
    res.json({ user: req.user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
});

// @route     GET api/users/logout
// @desc      Logout a user
// @access    Private
router.get("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.status(200).json("logout successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
});

// @route     GET api/users/logoutAll
// @desc      Logout a user from all devices
// @access    Private
router.get("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).json("Logged out from All devices");
  } catch (e) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
});

// @route     GET api/users/me
// @desc      user profile
// @access    Private
router.get("/me", auth, async (req, res) => {
  res.status(200).json(req.user);
});

// @route     PUT api/users/me
// @desc      update user profile
// @access    Private
router.put("/me", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.status(200).json(req.user);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
});

// @route     GET api/users/account/activate/:id
// @desc      activate user account
// @access    Private
router.get("/account/activate/:id", async (req, res) => {
  try {
    const user = await User.findOne({ activationString: req.params.id });
    if (!user) {
      return res.status(200).json("link expired");
    }
    user.activationString = null;
    user.isActivated = true;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
});

module.exports = router;
