// ==== IMPORTS
const express = require('express');
const router = express.Router();
const birdController = require('../controllers/birdController');

// ==== ROUTES
// path = /api/v1/bird
// index route - get all birds in a given birding session
router.get('/:birdingSessionId/', birdController.getBirdingSessionBirds);
// create new bird
router.post('/:birdingSessionId/', birdController.createBird);
// get one bird
// update a bird
// delete a bird

// ==== EXPORT
module.exports = router;