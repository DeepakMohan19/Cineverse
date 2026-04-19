const tmdbApi = require('../utils/tmdb');

const getTrending = async (req, res) => {
  try {
    const { data } = await tmdbApi.get('/trending/movie/week');
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNowPlaying = async (req, res) => {
  try {
    const { data } = await tmdbApi.get('/movie/now_playing');
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTopRated = async (req, res) => {
  try {
    const { data } = await tmdbApi.get('/movie/top_rated');
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUpcoming = async (req, res) => {
  try {
    const { data } = await tmdbApi.get('/movie/upcoming');
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await tmdbApi.get(`/movie/${id}?append_to_response=credits,images&include_image_language=en,null`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMovieVideos = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await tmdbApi.get(`/movie/${id}/videos`);
    
    // Filter for YouTube Trailers
    const trailers = data.results.filter(
      (video) => video.site === 'YouTube' && video.type === 'Trailer'
    );
    res.json({ results: trailers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getMoviesByLanguage = async (req, res) => {
  try {
    const { lang } = req.params;
    // TMDB language codes: ta (Tamil), te (Telugu), hi (Hindi), kn (Kannada), ml (Malayalam), ko (Korean)
    // To include shows and movies, we might have to use /discover/movie or /discover/tv.
    // For simplicity, returning movies via discover/movie sorted by popularity.
    const { data } = await tmdbApi.get(`/discover/movie?with_original_language=${lang}&sort_by=popularity.desc`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getDiscoverMovies = async (req, res) => {
  try {
    const { data } = await tmdbApi.get('/discover/movie', { params: req.query });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGenres = async (req, res) => {
  try {
    const { data } = await tmdbApi.get('/genre/movie/list');
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTrending,
  getNowPlaying,
  getTopRated,
  getUpcoming,
  getMovieDetails,
  getMovieVideos,
  getMoviesByLanguage,
  getDiscoverMovies,
  getGenres,
};
