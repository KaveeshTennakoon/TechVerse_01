const express = require('express');
const { registerUser, checkUsername } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', registerUser);
router.post('/check-username', checkUsername);

module.exports = router;