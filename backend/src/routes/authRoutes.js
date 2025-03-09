const express = require('express');
const { registerUser, checkUsername, loginUser, logoutUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/check-username', checkUsername);
router.post('/logout', protect, logoutUser);

module.exports = router;