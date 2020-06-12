// ==== IMPORTS
const express = require('express');
const router = express.Router();
const birdController = require('../controllers/birdController');

// ==== ROUTES
// path = /api/v1/bird
// index route - get all birds in a given birding session
router.get('/birdingSession/:birdingSessionId', birdController.getBirdingSessionBirds);
// create new bird
router.post('/birdingSession/:birdingSessionId', birdController.createBird);
// get one bird
router.get('/:birdingSessionId/bird/:id', birdController.getOneBird);
// router.get('/:id', birdController.getOneBird);
// update a bird
router.put('/:birdingSessionId/bird/:id', birdController.updateBird);
// router.put('/:id', birdController.updateBird);
// delete a bird
router.delete('/:birdingSessionId/bird/:id', birdController.deleteBird);
// router.delete('/:id', birdController.deleteBird);

// ==== EXPORT
module.exports = router;