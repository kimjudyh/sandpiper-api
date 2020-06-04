// ====== IMPORTS
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
require('dotenv').config();

// store sessions in mongoDB
const MongoStore = require('connect-mongo')(session);

const app = express();
const port = process.env.PORT || 4000;

// ====== CONTROLLERS

// ====== MIDDLEWARE

// ====== ROUTES
app.get('/', (req, res) => {
  res.send('Hello, world');
})

// ====== SERVER LISTENER
app.listen(port, () => {
  console.log('Server running on port', port);
})