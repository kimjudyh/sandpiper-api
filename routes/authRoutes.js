// ==== IMPORTS
const express = require('express');
const router = express.Router();
// const ctrl = require('../controllers');
const authController = require('../controllers/authController');

// ==== ROUTES
// path = /api/v1/auth
router.get('/register', authController.get_register);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.delete('/logout', authController.logout);

// ==== EXPORT
module.exports = router;