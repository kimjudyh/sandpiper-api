// ==== IMPORTS
const express = require('express');
const router = express.Router();
const behaviorController = require('../controllers/behaviorController');

// ==== ROUTES
// path = /api/v1/behavior
// index route - get all behaviors
router.get('/', behaviorController.getAllBehaviors);
// create new behavior
router.post('/', behaviorController.createBehavior);

// ==== EXPORT
module.exports = router;