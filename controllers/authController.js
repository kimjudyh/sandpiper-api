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
}

// Login - POST - create new express session
const login = async (req, res) => {

}

// Verify - GET - see if user is logged in or not
const verify = async (req, res) => {

}

// Logout - DELETE - delete express session
const logout = async (req, res) => {

}

// ==== EXPORT
module.exports = {
  get_register,
  register,
  login,
  verify,
  logout,
}