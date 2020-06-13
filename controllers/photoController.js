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
    // find user in db
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
    .populate('birdingSession', 'location')
    .populate('bird')
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

// Get photos from a birding session
// GET '/:birdingSessionId'
const getBirdingSessionPhotos = async (req, res) => {
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
    // find photos in db that have birding session id
    const foundPhotos = await db.Photo.find(
      {birdingSession: req.params.birdingSessionId}
    )
    .populate('birdingSession', 'location')
    .populate('bird')
    res.status(200).json({
      status: 200,
      message: "Got photos from birding session",
      foundPhotos
    })

  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
      message: "Something went wrong getting photos from birding session"
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
    .populate('birdingSession', 'location')
    .populate('bird')
    // send data as JSON
    res.status(200).json({
      status: 200,
      message: "Got photos of bird from birding session",
      foundPhotos
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

    res.status(200).json({
      status: 200,
      message: "Created a photo",
      newPhoto
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
      message: "Got photo",
      foundPhoto
    })

  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
      message: "Something went wrong getting a photo"
    })
  }
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
      message: "Updated photo",
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

    // delete from cloudinary
    cloudinary.v2.uploader.destroy(deletedPhoto.cloudinaryPublicId, (err, result) => {
      if (err) {
        console.log('error deleting from cloudinary', err);
      }
    });

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
  getBirdingSessionPhotos,
  getBirdFromBirdingSessionPhotos,
  createPhoto,
  getOnePhoto,
  updatePhoto,
  deletePhoto, 
}