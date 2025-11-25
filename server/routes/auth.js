const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const authController = require('../controllers/authController');

// Public routes
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Auth routes are working!'
    });
});

router.post('/register', authController.register);

// Protected routes
router.get('/profile', verifyToken, authController.getProfile);

router.post('/logout', verifyToken, (req, res) => {
    res.json({
        success: true,
        message: 'User logged out successfully'
    });
});

module.exports = router;