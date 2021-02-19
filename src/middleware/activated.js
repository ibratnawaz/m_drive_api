const User = require('../models/User')

async function userActivated(req, res, next) {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res
        .status(400)
        .json({ error: 'No account with this email found...' })
    }

    if (!user.isActivated) {
      return res.status(400).json({ error: 'Please activate your account' })
    }

    req.user = user
    next()
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

module.exports = userActivated
