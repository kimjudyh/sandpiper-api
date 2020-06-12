// ==== IMPORTS
const mongoose = require('mongoose');

// ==== SCHEMA
const PhotoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  cloudinaryPublicId: {
    type: String
  },
  location: {
    type: String,
  },
  date: {
    type: Date,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  bird: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bird'
  },
  birdingSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BirdingSession'
  }
})

// ==== CREATE MODEL
const Photo = mongoose.model('Photo', PhotoSchema);

// ==== EXPORT
module.exports = Photo;