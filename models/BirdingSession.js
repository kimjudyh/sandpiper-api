// ==== IMPORTS
const mongoose = require('mongoose');

// ==== SCHEMA
const BirdingSessionSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
  },
  birds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bird'
  }],
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true })

// ==== CREATE MODEL
const BirdingSession = mongoose.model('BirdingSession', BirdingSessionSchema);

// ==== EXPORT
module.exports = BirdingSession;