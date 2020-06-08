// ==== IMPORTS
const mongoose = require('mongoose');

// ==== SCHEMA
const BirdSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
  },
  behavior: {
    // use populate('behavior', 'name')
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Behavior'
    // type: String
  },
  unconfirmed: {
    type: Boolean,
  },
  fieldNotes: {
    type: String,
  },
  photos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photo'
  }],
  birdingSession: {
    // reference the BirdingSession location, date
    // use populate('birdingSession', 'location').
    // populate('birdingSession', 'date')
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BirdingSession'
  }
}, { timestamps: true })

// ==== CREATE MODEL
const Bird = mongoose.model('Bird', BirdSchema);

// ==== EXPORT
module.exports = Bird;