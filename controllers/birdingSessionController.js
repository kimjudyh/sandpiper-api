// ==== IMPORTS
const bcrypt = require('bcryptjs');

// ==== MODELS
const db = require('../models');

// ==== ROUTES
const getAllBirdingSessions = async (req, res) => {
  try {
    // get array of all sessions from db
    const allBirdingSessions = await db.BirdingSession.find();
    // return all sessions as JSON
    res.status(200).json({
      status: 200,
      message: "connected to get all sessions page",
      allBirdingSessions
    })

  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: err
    })
  }
}

const createBirdingSession = async (req, res) => {
  try {
    // check that user is logged in
    if (!req.session.currentUser) {
      return res.status(400).json({
        status: 400,
        message: "User not logged in"
      })
    } 
    // use req.body to create a new session object in db
    const newBirdingSessionData = {
      location: req.body.location,
      date: req.body.date,
      users: [req.session.currentUser]
    }
    const newBirdingSession = await db.BirdingSession.create(newBirdingSessionData);
    res.status(200).json({
      status: 200,
      message: "connected to create new session page",
      newBirdingSession
    })

  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: err
    })
  }
}

// ==== EXPORT
module.exports = {
  getAllBirdingSessions,
  createBirdingSession,
}