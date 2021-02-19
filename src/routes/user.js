require('dotenv').config()
const express = require('express')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid')
const User = require('../models/User')
const File = require('../models/File')
const activated = require('../middleware/activated')
const auth = require('../middleware/auth')
const sendMail = require('../helpers/sendMail')

const router = new express.Router()

// @route     GET api/users/
// @desc      Get logged in user
// @access    Private
router.get('/', auth, async (req, res) => {
  try {
    res.status(200).json(req.user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// @route     POST api/users/register
// @desc      Register a user
// @access    Public
router.post('/register', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    sendMail(user, 'activate')
    res.status(201).json({ user })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message })
  }
})

// @route     POST api/users/login
// @desc      Login a user
// @access    Public
router.post('/login', [activated], async (req, res) => {
  try {
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      req.user.password
    )

    if (!isPasswordMatch) {
      return res.status(400).json('Invalid email or password')
    }

    const token = await req.user.generateAuthToken()
    res.status(200).json({ user: req.user, token })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// @route     GET api/users/logout
// @desc      Logout a user
// @access    Private
router.get('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()

    res.status(200).json('logout successfully')
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// @route     GET api/users/logoutAll
// @desc      Logout a user from all devices
// @access    Private
router.get('/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.status(200).json('Logged out from All devices')
  } catch (e) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// @route     GET api/users/me
// @desc      user profile
// @access    Private
router.get('/me', auth, async (req, res) => {
  res.status(200).json(req.user)
})

// @route     PUT api/users/me
// @desc      update user profile
// @access    Private
router.put('/me', auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body)
    updates.forEach((update) => (req.user[update] = req.body[update]))
    await req.user.save()
    res.status(200).json(req.user)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// @route     GET api/users/account/activate/:id
// @desc      activate user account
// @access    Private
router.get('/account/activate/:id', async (req, res) => {
  try {
    const user = await User.findOne({ activationString: req.params.id })
    if (!user) {
      return res.status(200).json('link expired')
    }
    user.activationString = null
    user.isActivated = true
    await user.save()
    res.redirect(`https://m-drive-ui.herokuapp.com/login`)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// @route     GET api/users/forgot/password
// @desc      send link to the registered user to reset password
// @access    Public
router.post('/forgot/password', activated, async (req, res) => {
  try {
    sendMail(req.user, 'reset')
    res.status(200).json('Reset password link send to your e-mail account')
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// @route     GET api/users/forgot/password/redirect/:id
// @desc      redirect user to the reset password ui
// @access    Public
router.get('/forgot/password/redirect/:id', async (req, res) => {
  try {
    res.redirect(
      `https://m-drive-ui.herokuapp.com/reset/password/${req.params.id}`
    )
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

// @route     GET api/users/reset/password
// @desc      update the password
// @access    Private
router.put('/reset/password', async (req, res) => {
  try {
    const { password, _id } = req.body
    const user = await User.findById({ _id })

    if (!user) {
      return res
        .status(400)
        .json('No user found. Request new link to reset password.')
    }
    user.password = password
    user.save()
    res.status(200).json('Password updated successfully')
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

// @route     GET api/users/upload
// @desc      upload files/folders to aws s3
// @access    Private
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
})

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, '')
  },
})

const upload = multer({ storage }).array('file')

router.post('/upload', [auth, upload], async (req, res) => {
  try {
    for (let i = 0; i < req.files.length; i++) {
      let myFile = req.files[i].originalname.split('.')
      const fileType = myFile[myFile.length - 1]

      const params = {
        ACL: 'public-read',
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${uuidv4()}.${fileType}`,
        Body: req.files[i].buffer,
      }

      let awsRes = await s3.upload(params).promise()

      let data = {
        user: req.user._id,
        original_name: myFile.join('.'),
        aws_data: {
          ETag: awsRes.ETag,
          Location: awsRes.Location,
          key: awsRes.key,
        },
      }
      const file = new File(data)
      await file.save()
    }

    res.json({ message: 'file uploaded' })
  } catch (error) {
    console.log(error)
    res.json({ error: error.message })
  }
})

// @route     DELETE api/users/delete
// @desc      to delete the object stored in aws s3
// @access    private
router.delete('/delete/:id', [auth], async (req, res) => {
  try {
    const file = await File.findById(req.params.id)
    if (req.user._id.toString() != file.user.toString())
      return res.status(401).json({ error: 'Unauthorized' })
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.aws_data.key,
    }
    await s3.deleteObject(params).promise()
    await file.remove()
    res.json({ message: 'file removed !!' })
  } catch (error) {
    console.log(error)
    res.json({ error: error.message })
  }
})

// @route     GET api/users/list
// @desc      to fetch all the objects data stored in db
// @access    private
router.get('/list', [auth], async (req, res) => {
  try {
    /* to fetch all the objects stored in aws s3
     - const params = {
     -   Bucket: process.env.AWS_BUCKET_NAME,
     - }
     - let data = await s3.listObjects(params).promise()
    */
    const files = await File.find({ user: req.user._id })

    res.json({ user: req.user, files })
  } catch (error) {
    console.log(error)
    res.json({ error: error.message })
  }
})

module.exports = router
