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
// Get all photos
const getAllPhotos = async (req, res) => {
  try {
    console.log(req.session.currentUser);
    // get all sessions
    const allSessions = await db.BirdingSession.find({users: req.session.currentUser})
    .populate('birds', 'photos')
    .populate('photos')

    const allPhotos = await db.Photo.find({user: req.session.currentUser})

    // temp, return all sessions
    res.json({
      allSessions,
      allPhotos
    })

    // get all photos?

  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
      message: "Something went wrong getting all photos"
    })
  }
}

const getBirdFromBirdingSessionPhotos = async (req, res) => {
  try {
    // look in bird db by birding session id, bird id
    const foundBird = await db.Bird.findOne({
      birdingSession: req.params.birdingSessionId,
      _id: req.params.birdId
    })
      .populate('photos')

    res.json({
      foundBird,
      photos: foundBird.photos
    })

  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
      message: "Something went wrong getting photos of bird from birding session"
    })
  }
}

const createPhoto = async (req, res) => {
  try {
    const photoData = {
      ...req.body,
      bird: req.params.birdId,
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

const getOnePhoto = async (req, res) => {
  try {
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

// ==== EXPORT
module.exports = {
  getAllPhotos,
  getBirdFromBirdingSessionPhotos,
  createPhoto,
  getOnePhoto,
  // updatePhoto,
  // deletePhoto, 
}