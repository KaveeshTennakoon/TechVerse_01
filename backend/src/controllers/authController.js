const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check username length
    if (username.length < 8) {
      return res.status(400).json({ message: 'Username must be at least 8 characters long' });
    }

    // Check password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must include at least one lowercase letter, one uppercase letter, and one special character',
      });
    }

    // Check if user already exists
    const userExists = await UserModel.findByUsername(username);

    if (userExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create the user
    const user = await UserModel.create(username, password);

    if (user) {
      res.status(201).json({
        id: user.id,
        username: user.username,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(`Error in registerUser: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Check if username exists
// @route   POST /api/auth/check-username
// @access  Public
const checkUsername = async (req, res) => {
  try {
    const { username } = req.body;
    
    const userExists = await UserModel.findByUsername(username);
    
    if (userExists) {
      return res.json({ exists: true });
    }
    
    res.json({ exists: false });
  } catch (error) {
    console.error(`Error in checkUsername: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, checkUsername };