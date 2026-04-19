"use client";

import { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import Navbar from '../../components/Navbar';
import MovieCard from '../../components/MovieCard';
import api from '../../lib/api';
import { Movie } from '../../types';
import { getImageUrl } from '../../lib/tmdb';

export default function Search() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        searchMovies();
      } else {
        setMovies([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const searchMovies = async () => {
    setLoading(true);
    try {
      // NOTE: We need a backend route for Search. Since backend doesn't have it yet,
      // I'll add a direct proxy to TMDB search here, or proxy via backend if /movies/search/:query exists.
      // Let's use the TMDB API proxy locally for now, assuming we add a search controller later.
      const apiKey = "ac71acb3ff413eecf0b8e308a213eeb1";
      const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-netflix-dark pt-24 pb-12 px-4 md:px-12">
      <Navbar />
      
      <div className="max-w-4xl mx-auto mb-12 relative animate-fade-in">
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-4 text-gray-400 w-6 h-6" />
          <input
            type="text"
            placeholder="Search for movies, TV shows..."
            className="w-full bg-[#181818] text-white text-lg md:text-2xl p-4 pl-14 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-600 transition shadow-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center mt-20">
          <div className="w-12 h-12 border-4 border-netflix-red rounded-full border-t-transparent animate-spin"/>
        </div>
      ) : movies.length > 0 ? (
        <div>
          <h2 className="text-xl text-gray-400 mb-6 border-b border-gray-800 pb-2">Results for &quot;{query}&quot;</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {movies.map(movie => (
              movie.poster_path ? <MovieCard key={movie.id} movie={movie} /> : null
            ))}
          </div>
        </div>
      ) : query.trim() !== '' ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-2xl font-semibold mb-2">No results found for &quot;{query}&quot;</p>
          <p>Try searching with different keywords.</p>
        </div>
      ) : (
        <div className="text-center text-gray-600 mt-32 flex flex-col items-center opacity-50">
          <SearchIcon className="w-24 h-24 mb-4" />
          <p className="text-xl">Find your next favorite movie</p>
        </div>
      )}
    </div>
  );
}
