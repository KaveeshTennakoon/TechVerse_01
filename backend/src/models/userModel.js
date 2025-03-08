const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

const UserModel = {
  // Find a user by username
  findByUsername: async (username) => {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  },

  // Create a new user
  create: async (username, password) => {
    try {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const [result] = await pool.execute(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword]
      );

      if (result.insertId) {
        const [rows] = await pool.execute(
          'SELECT id, username, created_at FROM users WHERE id = ?',
          [result.insertId]
        );
        return rows[0];
      }
      return null;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  },

  // Check if a password matches
  comparePassword: async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
};

module.exports = UserModel;