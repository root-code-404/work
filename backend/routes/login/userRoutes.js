const express = require('express');
const router = express.Router();
const { signup, login, profile } = require('../../controllers/login/userController');
const authMiddleware = require('../../middleware/login/authMiddleware');

// Routes for signup and login
router.post('/signup', signup);
router.post('/login', login);

// Profile route protected by authentication middleware
router.get('/profile', authMiddleware, profile);

module.exports = router;
