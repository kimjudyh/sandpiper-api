// ==== IMPORTS
const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const photoController = require('../controllers/photoController');

// ==== ROUTES
// path = /api/v1/photo
// index route - get all photos
router.get('/', photoController.getAllPhotos);
// get all photos of a bird in a birding session
router.get('/:birdingSessionId/bird/:birdId', photoController.getBirdFromBirdingSessionPhotos);
// create photo
router.post('/:birdId', photoController.createPhoto);
// get single photo
// update photo
// delete photo

// ==== EXPORT
module.exports = router;