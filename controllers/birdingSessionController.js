// ==== IMPORTS

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
      ... req.body,
      users: [req.session.currentUser]
    }
    // print to console the data that will be stored
    console.log(newBirdingSessionData);
    // save to db
    const newBirdingSession = await db.BirdingSession.create(newBirdingSessionData);
    // return JSON confirmation message
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

const getOneBirdingSession = async (req, res) => {
  try {
    // find birding session in db by id
    const foundBirdingSession = await db.BirdingSession.findById(req.params.id);
    console.log('birding session', foundBirdingSession)
    // if doesn't exist, return error
    if (!foundBirdingSession) {
      return res.status(400).json({
        status: 400,
        message: `Could not find birding session with id ${req.params.id}`
      })
    }
    // return it as JSON
    res.status(200).json({
      status: 200,
      message: `Found birding session with id ${req.params.id}`,
      foundBirdingSession
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
  getOneBirdingSession,
}