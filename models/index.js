// ====== IMPORTS
const mongoose = require('mongoose');
require('dotenv').config();

// ====== CONFIG
const connectionString = process.env.ATLAS_MONGODB_URI || 'mongodb://localhost:27017/final-project';
const configOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  poolSize: 10, // Maintain up to 10 socket connections
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

// ======== CONNECT
mongoose.connect(connectionString, configOptions)
  .then(() => {
    console.log('Connected to mongoDB');
  })
  .catch((err) => {
    console.log(err);
  })

// ====== EXPORTS
module.exports= {
  User: require('./User'),
  BirdingSession: require('./BirdingSession'),
  Bird: require('./Bird'),
  Photo: require('./Photo'),
  Behavior: require('./Behavior'),
}