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

// ====== CONTROLLERS & ROUTES
// index.js --> routes --> controllers
const routes = require('./routes');

// // temp database connection
// const db = require('./models')

// ====== MIDDLEWARE
app.use(express.json());

// ====== ROUTES
// Auth Routes
app.use('/api/v1/auth', routes.authRoutes);

app.get('/', (req, res) => {
  res.send('Hello, world');
})

// ====== SERVER LISTENER
app.listen(port, () => {
  console.log('Server running on port', port);
})