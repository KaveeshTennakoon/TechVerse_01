const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  // Check for token in cookies, headers, or query string
  if (
    req.cookies.jwt ||
    (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
  ) {
    try {
      // Get token from cookie or header
      token = req.cookies.jwt || req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token payload
      const user = await UserModel.findById(decoded.id);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Set user in request object (exclude password)
      req.user = {
        id: user.id,
        username: user.username
      };

      next();
    } catch (error) {
      console.error(`Auth error: ${error.message}`);
      res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };