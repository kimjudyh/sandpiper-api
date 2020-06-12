// ===== IMPORTS
const mongoose = require('mongoose');

// ===== SCHEMA
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    unique: true,
    required: true,
  },
  birdingSessions : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BirdSession',
  }]
}, { timestamps: true });

// ===== CREATE MODEL
const User = mongoose.model('User', UserSchema);

// ====== EXPORT
module.exports = User;