// ====== IMPORTS
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

// store sessions in mongoDB
const MongoStore = require('connect-mongo')(session);

const app = express();
const port = process.env.PORT || 4000;

// ====== CONTROLLERS & ROUTES
// /routes/index.js --> routes --> controllers
const routes = require('./routes');

// ====== MIDDLEWARE
// CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'https://sandpiper-react.herokuapp.com'],
  credentials: true, // allows session cookie to be sent back and forth from server to client
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
// set up sessions with MongoStore
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/final-project';
app.use(session({
  secret: (process.env.SESSION_SECRET || 'finalprojectkey'),
  resave: false, // only save session if we set or mutate property on session
  saveUninitialized: false, // only save cookie when we set property
  // store session in mongoDB
  store: new MongoStore(
    { url: connectionString }
  ),
  cookie: {
    maxAge: 1000 * 3600 * 24 * 4, // 4 day long session
  }
}));

// ====== ROUTES
// Auth Routes
app.use('/api/v1/auth', routes.authRoutes);
// BirdingSession (for birdwatching) Routes
app.use('/api/v1/birdingSession', routes.birdingSessionRoutes);
// Bird Routes
app.use('/api/v1/bird', routes.birdRoutes);
// Photo Routes
app.use('/api/v1/photo', routes.photoRoutes);
// Behavior Routes
app.use('/api/v1/behavior', routes.behaviorRoutes);

app.get('/', (req, res) => {
  res.send('Hello, world');
})

// ====== SERVER LISTENER
app.listen(port, () => {
  console.log('Server running on port', port);
})