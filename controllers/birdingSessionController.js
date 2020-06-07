// ==== IMPORTS

// ==== MODELS
const db = require('../models');

// ==== ROUTES
// Get all birding sessions
const getAllBirdingSessions = async (req, res) => {
  // TODO: user authorization: show only sessions that contain user's id
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

// Create a birding session
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

// Get one birding session by ID
const getOneBirdingSession = async (req, res) => {
  // TODO: user authorization
  try {
    // find by birding session id AND user id
    const foundBirdingSession = await db.BirdingSession.findOne(
      {_id: req.params.id, users: req.session.currentUser});
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
      err,
      message: 'Something went wrong trying to get birding session'
    })
  }
}

// Update a birding session
const updateBirdingSession = async (req, res) => {
  try {
    // TODO: user authorization
    // get birding session by id, update in db
    const updatedBirdingSession = await db.BirdingSession.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}
      )
    // if no birding session found, return error
    if (!updatedBirdingSession) {
      return res.status(400).json({
        status: 400,
        message: `Birding session id ${req.params.id} not found`
      })
    }
    // else return as JSON
    res.status(200).json({
      status: 200,
      message: "on update page",
      updatedBirdingSession
    })

  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: err
    })

  }
}

const deleteBirdingSession = async (req, res) => {
  try {
    // TODO: user authorization
    // TODO: check that user can delete this session
    // find by id and delete from database
    const deletedBirdingSession = await db.BirdingSession.findByIdAndDelete(req.params.id);
    // if birding session not found, return error
    if (!deletedBirdingSession) {
      return res.status(400).json({
        status: 400,
        message: `Birding session id ${req.params.id} not found`
      })
    }
    // TODO: delete birds associated with session from db
    // return confirmation of deletion
    res.status(200).json({
      status: 200,
      message: "Session deleted",
      deletedBirdingSession
    })
    

  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: err
    })
  }
}

const shareBirdingSession = async (req, res) => {
  try {
    // look up users by email in db to see if they're registered
    // if yes, add them to birding session
    // req.body.email - multiple email fields?
    if (req.body.email) {
      const foundUser = await db.User.findOne({ email: req.body.email });
      if (!foundUser) {
        // user not registered
        return res.json({
          message: "User not registered"
        })
      }
      // if user is already a collaborator on birding session, return error
      const userAlreadyExists = await db.BirdingSession.findOne(
        {_id: req.params.id, users: foundUser._id}
      )
      if (userAlreadyExists) {
        return res.status(400).json({
          status: 400,
          message: "User is already a collaborator on this birding session",
          userAlreadyExists
        })
      }
      // add to birding session users array, provided via url req.params.id
      const updatedBirdingSession = await db.BirdingSession.findByIdAndUpdate(
        req.params.id,
        {$push: {users: foundUser._id}},
        { new: true }
      )
      return res.status(200).json({
        status: 200,
        message: "User added to birding session",
        updatedBirdingSession
      })
    } else {
      return res.status(400).json({
        status: 400,
        message: "No user to add"
      })
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
      message: "Something went wrong adding a user to the birding session"
    })
  }
}

const unshareBirdingSession = async (req, res) => {
  try {
    // look up user by email to get user id
    const foundUser = await db.User.findOne({email: req.body.email});
    // find birding session to update
    const foundBirdingSession = await db.BirdingSession.findByIdAndUpdate(
      {_id: req.params.id},
      {$pull: {users: foundUser._id}},
      {new: true}
    )
    res.status(200).json({
      status: 200,
      message: `Removed user ${req.body.email} from birding session`,
      foundBirdingSession
    })
    
  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
      message: "Something went wrong removing a user from the birding session"
    })
  }
}

// ==== EXPORT
module.exports = {
  getAllBirdingSessions,
  createBirdingSession,
  getOneBirdingSession,
  updateBirdingSession,
  deleteBirdingSession,
  shareBirdingSession,
  unshareBirdingSession,
}