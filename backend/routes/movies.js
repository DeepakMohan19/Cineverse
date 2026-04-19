const express = require('express');
const { 
  getTrending, 
  getNowPlaying, 
  getTopRated, 
  getUpcoming, 
  getMovieDetails, 
  getMovieVideos,
  getMoviesByLanguage,
  getDiscoverMovies,
  getGenres
} = require('../controllers/movieController');

const router = express.Router();

router.get('/trending', getTrending);
router.get('/now_playing', getNowPlaying);
router.get('/top_rated', getTopRated);
router.get('/upcoming', getUpcoming);
router.get('/language/:lang', getMoviesByLanguage);

// Important: Specific routes should be defined before parameter routes
router.get('/discover', getDiscoverMovies);
router.get('/genres', getGenres);

router.get('/:id', getMovieDetails);
router.get('/:id/videos', getMovieVideos);

module.exports = router;
