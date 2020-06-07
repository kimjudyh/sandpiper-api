// ==== IMPORTS
const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const photoController = require('../controllers/photoController');

// ==== ROUTES
// path = /api/v1/photo
// index route - get all photos by user (or get all photos from all sessions, including photos from other users?)
router.get('/', photoController.getAllPhotos);
// get all photos of a bird in a birding session
router.get('/:birdingSessionId/bird/:birdId', photoController.getBirdFromBirdingSessionPhotos);
// create photo associated with a specific bird
router.post('/:birdId', photoController.createPhoto);
// get single photo
router.get('/:id', photoController.getOnePhoto);
// update photo
// delete photo

// ==== EXPORT
module.exports = router;