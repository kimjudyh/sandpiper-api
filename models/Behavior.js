// ==== IMPORTS
const mongoose = require('mongoose');

// ==== SCHEMA
const BehaviorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String
  }
})

// ==== CREATE MODEL
const Behavior = mongoose.model('Behavior', BehaviorSchema);

// ==== EXPORT
module.exports = Behavior;