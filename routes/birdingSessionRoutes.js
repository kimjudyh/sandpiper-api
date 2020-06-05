// ==== IMPORTS
const express = require('express');
const router = express.Router();
const birdingSessionController = require('../controllers/birdingSessionController');

// ==== ROUTES
// path = /api/v1/birdingSession
// index route - get all sessions
router.get('/', birdingSessionController.getAllBirdingSessions);
// create new session
router.post('/new', birdingSessionController.createBirdingSession);

// ==== EXPORT
module.exports = router;