// ==== IMPORTS
const bcrypt = require('bcryptjs');

// ==== MODELS
const db = require('../models');

// ==== ROUTES
// test to see that this controller is connected to server
const get_register = (req, res) => {
  res.send('At the register route')
}

// Register - POST - create new user
const register = async (req, res) => {
  try {
    console.log('In Register Route')
    // check if the user already exists
    const existingUser = await db.User.findOne( { email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        status: 400,
        message: "A user with that email already exists."
      })
    }
    // TODO: check validity of data being sent
    // password is unique
    // check that the 2 passwords match
    if (req.body.password !== req.body.password2) {
      return res.status(400).json({
        status: 400,
        message: "Passwords don't match"
      })
    }

    // create a new user
    // generate salt (adds complication to password hash)
    const salt = bcrypt.genSaltSync(10);
    // hash password
    const hash = bcrypt.hashSync(req.body.password, salt);
    // create user object
    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: hash
    };

    // save user to database
    const newUser = await db.User.create(userData);
    // send some confirmation message as JSON
    return res.status(200).json({ 
      status: 200,
      message: "User registered",
      userData: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt
      }
    })

  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: err
    })

  }
}

// Login - POST - create new express session
const login = async (req, res) => {
  try {
    // check for existing user account in db
    const foundUser = await db.User.findOne({ email: req.body.email });
    // if user doesn't exist, return an error
    if (!foundUser) {
      return res.status(400).json({
        status: 400,
        message: "Invalid Credentials"
      })
    }
    // check that password matches
    const passwordsMatch = bcrypt.compareSync(req.body.password, foundUser.password);
    // if passwords don't match, return an error
    if (!passwordsMatch) {
      return res.status(400).json({
        status: 400,
        message: "Invalid Credentials"
      })
    }
    // if passwords match, create new session
    // attach currentUser property to cookie
    req.session.currentUser = foundUser._id;
    console.log(foundUser._id)
    console.log('session', req.session)

    return res.status(200).json({
      status: 200,
      id: foundUser._id,
      email: foundUser.email,
      name: foundUser.name,
      message: "Logged in"
    })
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: err
    })
  }
}

// Verify - GET - see if user is logged in or not
const verify = async (req, res) => {
  if (!req.session.currentUser) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized"
    })
  } else {
    res.status(200).json({
      status: 200,
      message: `Current user verified with ID ${req.session.currentUser}`
    });
  }
}

// Logout - DELETE - delete express session
const logout = async (req, res) => {
  try {
    console.log('in logout')
    // check if a user is logged in
    if (!req.session.currentUser) {
      return res.status(400).json({
        status: 400,
        message: "Session not active."
      })
    } else {
      await req.session.destroy();
      res.status(200).json({
        status: 200,
        message: "Logged Out"
      })
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: err
    })
  }

}

// ==== EXPORT
module.exports = {
  get_register,
  register,
  login,
  verify,
  logout,
}