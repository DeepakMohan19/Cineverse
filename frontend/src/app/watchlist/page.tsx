"use client";

import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import MovieCard from '../../components/MovieCard';
import { useAuth } from '../../hooks/useAuth';
import { useWatchlist } from '../../hooks/useWatchlist';
import api from '../../lib/api';
import { Movie } from '../../types';

export default function Watchlist() {
  const { user } = useAuth();
  const { watchlist, fetchWatchlist, removeFromWatchlist } = useWatchlist();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) {
      fetchWatchlist();
    } else {
      setLoading(false);
    }
  }, [user, fetchWatchlist]);

  useEffect(() => {
    async function fetchMovies() {
      if (watchlist.length > 0) {
        setLoading(true);
        try {
          const moviePromises = watchlist.map(id => api.get(`/movies/${id}`));
          const responses = await Promise.all(moviePromises);
          setMovies(responses.map(res => res.data));
        } catch (error) {
          console.error("Error fetching watchlist movies:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setMovies([]);
        setLoading(false);
      }
    }
    
    if (user && watchlist.length > 0) {
      fetchMovies();
    }
  }, [watchlist, user]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-netflix-dark pt-24 px-2 md:px-4 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-red-500 rounded-full border-t-transparent animate-spin"/>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-netflix-dark text-white flex flex-col pt-24 items-center">
        <Navbar />
        <h1 className="text-4xl font-bold mt-20 mb-6">Your Watchlist</h1>
        <p className="text-xl text-gray-400">Please sign in to view your watchlist.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-dark pt-24 pb-12 px-4 md:px-12">
      <Navbar />
      <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 border-b border-gray-800 pb-4">My Watchlist</h1>
      
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 md:h-72 bg-gray-800/40 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} onRemove={removeFromWatchlist} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-2xl font-semibold mb-2 text-white">Your watchlist is empty.</p>
          <p>Explore movies and add them to your list!</p>
        </div>
      )}
    </div>
  );
}
