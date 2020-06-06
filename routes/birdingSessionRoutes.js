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
// get one birding session
router.get('/:id', birdingSessionController.getOneBirdingSession);
// update birding session
router.put('/:id', birdingSessionController.updateBirdingSession);
// delete birding session
router.delete('/:id', birdingSessionController.deleteBirdingSession);

// ==== EXPORT
module.exports = router;