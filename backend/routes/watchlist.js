const express = require('express');
const { getWatchlist, addToWatchlist, removeFromWatchlist } = require('../controllers/watchlistController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getWatchlist)
  .post(protect, addToWatchlist);

router.route('/:movieId')
  .delete(protect, removeFromWatchlist);

module.exports = router;
