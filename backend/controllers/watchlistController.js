const User = require('../models/User');

const getWatchlist = async (req, res) => {
  try {
    // req.user is already populated by the protect middleware
    res.json(req.user.watchlist || []);
  } catch (error) {
    console.error('getWatchlist error:', error);
    res.status(500).json({ message: 'Error fetching watchlist' });
  }
};

const addToWatchlist = async (req, res) => {
  try {
    const { movieId } = req.body;
    
    if (!movieId) {
      return res.status(400).json({ message: 'Movie ID is required' });
    }

    const user = req.user;
    
    // Ensure watchlist exists
    if (!user.watchlist) {
      user.watchlist = [];
    }

    if (!user.watchlist.includes(movieId.toString())) {
      user.watchlist.push(movieId.toString());
      await user.save();
    }

    res.json(user.watchlist);
  } catch (error) {
    console.error('addToWatchlist error:', error);
    res.status(500).json({ message: error.message || 'Error adding to watchlist' });
  }
};

const removeFromWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params;
    const user = req.user;

    if (!user.watchlist) {
      return res.json([]);
    }

    user.watchlist = user.watchlist.filter(id => id !== movieId.toString());
    await user.save();

    res.json(user.watchlist);
  } catch (error) {
    console.error('removeFromWatchlist error:', error);
    res.status(500).json({ message: 'Error removing from watchlist' });
  }
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
};
