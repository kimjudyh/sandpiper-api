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

// ====== MIDDLEWARE
app.use(express.json());
// set up sessions with MongoStore
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/final-project';
app.use(session({
  secret: (process.env.SESSION_SECRET || 'finalprojectkey'),
  resave: false, // only save session if we set or mutate property on session
  saveUninitialized: false, // only save cookie when we set property
  // store session in mongoDB
  store: new MongoStore(
    { url: connectionString }
  )
}));

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