const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// GET /api/user - Get current user info
router.get('/api/user', protect, (req, res) => {
  res.json({ username: req.user.username });
});

// GET /api/dashboard - Get dashboard data
router.get('/api/dashboard', protect, (req, res) => {
  res.json({
    recentMatches: 24,
    teamMembers: 16,
    upcomingEvents: 3,
    recentActivity: [
      { title: "Team Practice", time: "2 hours ago", type: "practice" },
      { title: "Match vs Eagles", time: "Yesterday", type: "match" },
      { title: "Strategy Meeting", time: "2 days ago", type: "meeting" },
    ]
  });
});

module.exports = router;