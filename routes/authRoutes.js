// ==== IMPORTS
const express = require('express');
const router = express.Router();
// const ctrl = require('../controllers');
const authController = require('../controllers/authController');

// ==== ROUTES
// path = /api/v1/auth
router.get('/register', authController.get_register);
// Register
router.post('/register', authController.register);
// Login
router.post('/login', authController.login);
// Verify
router.get('/verify', authController.verify);
// Logout
router.delete('/logout', authController.logout);

// ==== EXPORT
module.exports = router;