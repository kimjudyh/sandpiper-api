// ==== IMPORTS

// ==== MODELS
const db = require('../models');

// ==== ROUTES
// Get all birding sessions
// GET '/'
const getAllBirdingSessions = async (req, res) => {
  // check that user is logged in
  if (!req.session.currentUser) {
    return res.status(400).json({
      status: 400,
      message: "User not logged in"
    })
  } 
  try {
    // get array of all sessions from db that user is part of
    const allBirdingSessions = await db.BirdingSession.find({users: req.session.currentUser})
    .populate('users', 'name');
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
// POST '/'
const createBirdingSession = async (req, res) => {
  // check that user is logged in
  if (!req.session.currentUser) {
    return res.status(400).json({
      status: 400,
      message: "User not logged in"
    })
  } 
  try {
    // use req.body to create a new session object in db
    const newBirdingSessionData = {
      ... req.body,
      users: [req.session.currentUser]
    }
    // print to console the data that will be stored
    console.log(newBirdingSessionData);
    // save to db
    const newBirdingSession = await db.BirdingSession.create(newBirdingSessionData);
    // remove?
    // push birding session id to User's birding session array
    // const foundUser = await db.User.findById(req.session.currentUser);
    // foundUser.birdingSessions.push(newBirdingSession._id);
    // const savedUser = await foundUser.save();
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
// GET '/:id'
const getOneBirdingSession = async (req, res) => {
  // check that user is logged in
  if (!req.session.currentUser) {
    return res.status(400).json({
      status: 400,
      message: "User not logged in"
    })
  } 
  try {
    console.log('in get one birding session');
    // find by birding session id AND user id
    const foundBirdingSession = await db.BirdingSession.findOne(
      {_id: req.params.id, users: req.session.currentUser})
      .populate('users', 'name');
    console.log('birding session', foundBirdingSession)
    // if doesn't exist, return error
    if (!foundBirdingSession) {
      return res.status(400).json({
        status: 400,
        message: `Birding Session not found, or user doesn't have correct permissions`
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
// PUT '/:id'
const updateBirdingSession = async (req, res) => {
  // check that user is logged in
  if (!req.session.currentUser) {
    return res.status(400).json({
      status: 400,
      message: "User not logged in"
    })
  } 
  try {
    // get birding session by id, update in db
    const updatedBirdingSession = await db.BirdingSession.findOneAndUpdate(
      // make sure user has permission to update
      {_id: req.params.id, users: req.session.currentUser},
      req.body,
      {new: true}
      )
    // if no birding session found, return error
    if (!updatedBirdingSession) {
      return res.status(400).json({
        status: 400,
        message: `Birding Session not found, or user doesn't have correct permissions`
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

// Delete a birding session
// DELETE '/:id'
const deleteBirdingSession = async (req, res) => {
  // check that user is logged in
  if (!req.session.currentUser) {
    return res.status(400).json({
      status: 400,
      message: "User not logged in"
    })
  } 
  try {
    // check that user can delete this session
    // find by id and delete from database
    const deletedBirdingSession = await db.BirdingSession.findOneAndDelete(
      {_id: req.params.id, users: req.session.currentUser}
    )
    // if birding session not found, return error
    if (!deletedBirdingSession) {
      return res.status(400).json({
        status: 400,
        message: `Birding Session not found, or user doesn't have correct permissions`
      })
    }
    // delete birds associated with session from db
    const deletedBirds = await db.Bird.deleteMany({birdingSession: req.params.id})

    // delete photos associated with session
    const deletedPhotos = await db.Photo.deleteMany({birdingSession: req.params.id})
    // remove?
    // delete birding session id from User's birding sessions array
    // const foundUser = await db.User.findByIdAndUpdate(
      // {_id: req.session.currentUser}, 
      // {$pull: {birdingSessions: req.params.id}},
      // {new: true}
    // )
    // return confirmation of deletion
    res.status(200).json({
      status: 200,
      message: "Session deleted",
      deletedBirdingSession,
      deletedBirds,
      // foundUser
    })
    

  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: err
    })
  }
}

// Add a user to collaborate on birding session
// PUT '/share/:id'
const shareBirdingSession = async (req, res) => {
  // check that user is logged in
  if (!req.session.currentUser) {
    return res.status(400).json({
      status: 400,
      message: "User not logged in"
    })
  } 
  try {
    console.log('share', req.body);
    // check user has permission to access this birding session
    const foundBirdingSession = await db.BirdingSession.findOne(
      {users: req.session.currentUser, _id: req.params.id}
    );
    console.log('found share', foundBirdingSession);
    if (!foundBirdingSession) {
      return res.status(400).json({
        status: 400,
        message: `Birding Session not found, or user doesn't have correct permissions`
      })
    }
    // req.body.email - multiple email fields?
    // if email field empty
    if (!req.body.email) {
      return res.status(400).json({
        status: 400,
        message: "No user to add"
      })
    }
    // look up user by email in db
    const foundUser = await db.User.findOne({ email: req.body.email });
    // if no found user, user is not registered
    if (!foundUser) {
      return res.status(400).json({
        status: 400,
        message: "User not registered"
      })
    }
    // if user is already a collaborator on birding session, return error
    const userAlreadyExists = await db.BirdingSession.findOne(
      { _id: req.params.id, users: foundUser._id }
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
      { $push: { users: foundUser._id } },
      { new: true }
    )
    // return data as JSON
    return res.status(200).json({
      status: 200,
      message: "User added to birding session",
      updatedBirdingSession
    })

  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
      message: "Something went wrong adding a user to the birding session"
    })
  }
}

// Remove a user from birding session
// PUT '/unshare/:id'
const unshareBirdingSession = async (req, res) => {
  // check that user is logged in
  if (!req.session.currentUser) {
    return res.status(400).json({
      status: 400,
      message: "User not logged in"
    })
  } 
  try {
    // check user has permission to access this birding session
    const foundBirdingSession = await db.BirdingSession.findOne(
      {users: req.session.currentUser, _id: req.params.birdingSessionId}
    );
    if (!foundBirdingSession) {
      return res.status(400).json({
        status: 400,
        message: `Birding Session not found, or user doesn't have correct permissions`
      })
    }
    // look up user by email to get user id
    const foundUser = await db.User.findOne({email: req.body.email});
    // if no found user, return error
    if (!foundUser) {
      return res.status(400).json({
        status: 400,
        message: "User not found"
      })
    }
    // find birding session to update and remove user from users array
    const updatedBirdingSession = await db.BirdingSession.findByIdAndUpdate(
      {_id: req.params.id},
      {$pull: {users: foundUser._id}},
      {new: true}
    )
    // if no found birding session, return error
    if (!updatedBirdingSession) {
      return res.status(400).json({
        status: 400,
        message: "No birding session found"
      })
    }
    // return data as JSON
    res.status(200).json({
      status: 200,
      message: `Removed user ${req.body.email} from birding session`,
      updatedBirdingSession
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