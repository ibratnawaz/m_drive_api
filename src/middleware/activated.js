const User = require("../models/User");

async function userActivated(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json("No account with this email found...");
    }

    if (!user.isActivated) {
      return res.status(400).json("Please activate your account");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
}

module.exports = userActivated;
