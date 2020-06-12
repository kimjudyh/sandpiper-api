// ==== IMPORTS
const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');

// ==== ROUTES
// path = /api/v1/photo
// index route - get all photos by user (or get all photos from all sessions, including photos from other users?)
router.get('/', photoController.getAllPhotos);

// get all photos in a birding session
router.get('/:birdingSessionId', photoController.getBirdingSessionPhotos);

// get all photos of a bird in a birding session
router.get('/:birdingSessionId/bird/:birdId', photoController.getBirdFromBirdingSessionPhotos);

// create photo associated with a specific bird
router.post('/:birdingSessionId/bird/:birdId', photoController.createPhoto);

// get single photo
router.get('/:birdingSessionId/:id', photoController.getOnePhoto);

// update photo
router.put('/:birdingSessionId/:id', photoController.updatePhoto);

// delete photo
router.delete('/:birdingSessionId/:id', photoController.deletePhoto);

// ==== EXPORT
module.exports = router;