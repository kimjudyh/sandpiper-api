// ==== IMPORTS
const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

// ==== MODEL
const db = require('../models');

// ==== ROUTES
// Get all photos that user has permission to view,
// including photos shared in birding sessions by other users
// GET '/'
const getAllPhotos = async (req, res) => {
  // check that user is logged in
  if (!req.session.currentUser) {
    return res.status(400).json({
      status: 400,
      message: "User not logged in"
    })
  } 
  try {
    console.log(req.session.currentUser);
    // find user in db
    // const foundUser = await db.User.findById(req.session.currentUser);
    // find birding sessions that contain user id
    const foundBirdingSessions = await db.BirdingSession.find(
      {users: req.session.currentUser}
    )
    // return as an array of _ids
      .distinct('_id');
    console.log('found b sessions:', foundBirdingSessions)
    // use array of birding session IDs
    const foundPhotos = await db.Photo.find(
      {birdingSession: {$in: foundBirdingSessions}}
    )
    // return found photos as JSON
    res.status(200).json({
      status: 200,
      foundBirdingSessions,
      foundPhotos
    })

  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
      message: "Something went wrong getting all photos"
    })
  }
}

// Get photos of one bird from a birding session
// GET '/:birdingSessionId/bird/:birdId
const getBirdFromBirdingSessionPhotos = async (req, res) => {
  // check that user is logged in
  if (!req.session.currentUser) {
    return res.status(400).json({
      status: 400,
      message: "User not logged in"
    })
  } 
  try {
    // check that user has permission to access this birding session
    const foundBirdingSession = await db.BirdingSession.findOne(
      {users: req.session.currentUser, _id: req.params.birdingSessionId}
    );
    if (!foundBirdingSession) {
      return res.status(400).json({
        status: 400,
        message: `Birding Session not found, or user doesn't have correct permissions`
      })
    }
    // find photos in db that have birding session id AND bird id
    const foundPhotos = await db.Photo.find(
      {bird: req.params.birdId, birdingSession: req.params.birdingSessionId}
    )
    // look in bird db by birding session id, bird id
    // const foundBird = await db.Bird.findOne({
    //   birdingSession: req.params.birdingSessionId,
    //   _id: req.params.birdId
    // })
    //   .populate('photos')
    // send data as JSON
    res.status(200).json({
      status: 200,
      foundPhotos
      // photos: foundBird.photos
    })

  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
      message: "Something went wrong getting photos of bird from birding session"
    })
  }
}

// Create photo associated with specific bird, birding session
// POST '/:birdingSessionId/bird/:birdId
const createPhoto = async (req, res) => {
  // check that user is logged in
  if (!req.session.currentUser) {
    return res.status(400).json({
      status: 400,
      message: "User not logged in"
    })
  } 
  try {
    // check that user has permission to access this birding session
    const foundBirdingSession = await db.BirdingSession.findOne(
      {users: req.session.currentUser, _id: req.params.birdingSessionId}
    );
    if (!foundBirdingSession) {
      return res.status(400).json({
        status: 400,
        message: `Birding Session not found, or user doesn't have correct permissions`
      })
    }
    const photoData = {
      ...req.body,
      bird: req.params.birdId,
      birdingSession: req.params.birdingSessionId,
      user: req.session.currentUser
    }
    const newPhoto = await db.Photo.create(photoData);
    const foundBird = await db.Bird.findById(req.params.birdId);
    foundBird.photos.push(newPhoto._id);
    const savedBird = foundBird.save();

    res.status(200).json({
      status: 200,
      newPhoto,
      savedBird
    })

  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
      message: "Something went wrong creating a photo"
    })
  }
}

// Get single photo
// GET '/:birdingSessionId/:id'
const getOnePhoto = async (req, res) => {
  // check that user is logged in
  if (!req.session.currentUser) {
    return res.status(400).json({
      status: 400,
      message: "User not logged in"
    })
  } 
  try {
    // check that user has permission to access this birding session
    const foundBirdingSession = await db.BirdingSession.findOne(
      {users: req.session.currentUser, _id: req.params.birdingSessionId}
    );
    if (!foundBirdingSession) {
      return res.status(400).json({
        status: 400,
        message: `Birding Session not found, or user doesn't have correct permissions`
      })
    }
    const foundPhoto = await db.Photo.findById(req.params.id);
    res.status(200).json({
      status: 200,
      foundPhoto
    })

  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
      message: "Something went wrong getting a photo"
    })
  }
  // get photo by id
}

// Update a photo
// PUT '/:birdingSessionId/:id'
const updatePhoto = async (req, res) => {
  // check that user is logged in
  if (!req.session.currentUser) {
    return res.status(400).json({
      status: 400,
      message: "User not logged in"
    })
  } 
  try {
    // check that user has permission to access this birding session
    const foundBirdingSession = await db.BirdingSession.findOne(
      {users: req.session.currentUser, _id: req.params.birdingSessionId}
    );
    if (!foundBirdingSession) {
      return res.status(400).json({
        status: 400,
        message: `Birding Session not found, or user doesn't have correct permissions`
      })
    }
    // get photo by id in db, update
    const updatedPhoto = await db.Photo.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}
    );
    // return data as JSON
    res.status(200).json({
      status: 200,
      updatedPhoto
    })

  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
      message: "Something went wrong updating a photo"
    })
  }
}

// Delete a photo
const deletePhoto = async (req, res) => {
  // check that user is logged in
  if (!req.session.currentUser) {
    return res.status(400).json({
      status: 400,
      message: "User not logged in"
    })
  } 
  try {
    // check that user has permission to access this birding session
    const foundBirdingSession = await db.BirdingSession.findOne(
      {users: req.session.currentUser, _id: req.params.birdingSessionId}
    );
    if (!foundBirdingSession) {
      return res.status(400).json({
        status: 400,
        message: `Birding Session not found, or user doesn't have correct permissions`
      })
    }
    // find photo in db by id and delete
    const deletedPhoto = await db.Photo.findByIdAndDelete(req.params.id);
    // return data as json
    res.status(200).json({
      status: 200,
      message: "Deleted photo",
      deletedPhoto
    })

  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
      message: "Something went wrong deleting a photo"
    })
  }
}

// ==== EXPORT
module.exports = {
  getAllPhotos,
  getBirdFromBirdingSessionPhotos,
  createPhoto,
  getOnePhoto,
  updatePhoto,
  deletePhoto, 
}