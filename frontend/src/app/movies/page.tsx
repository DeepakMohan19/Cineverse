"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import api from '@/lib/api';
import { Movie } from '@/types';
import { Loader2 } from 'lucide-react';

interface Genre {
  id: number;
  name: string;
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');

  const years = Array.from({ length: 6 }, (_, i) => 2025 - i);

  const ratings = [
    { label: 'Any Rating', value: '' },
    { label: '5+ Stars', value: '5' },
    { label: '6+ Stars', value: '6' },
    { label: '7+ Stars', value: '7' },
    { label: '8+ Stars', value: '8' },
    { label: '9+ Stars', value: '9' },
  ];

  const sortOptions = [
    { label: 'Popularity', value: 'popularity.desc' },
    { label: 'Release Date', value: 'primary_release_date.desc' },
    { label: 'Rating', value: 'vote_average.desc' },
  ];

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const { data } = await api.get('/movies/genres');
        setGenres(data.genres || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGenres();
  }, []);

  const fetchMovies = async (pageNum: number, append = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);

      const params = new URLSearchParams();
      params.append('page', pageNum.toString());

      if (selectedGenre) params.append('with_genres', selectedGenre);
      if (selectedYear) params.append('primary_release_year', selectedYear);
      if (selectedRating) params.append('vote_average.gte', selectedRating);
      if (sortBy) params.append('sort_by', sortBy);

      const { data } = await api.get(`/movies/discover?${params.toString()}`);

      if (append) {
        setMovies(prev => [...prev, ...data.results]);
      } else {
        setMovies(data.results);
      }

      setTotalPages(data.total_pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchMovies(1, false);
  }, [selectedGenre, selectedYear, selectedRating, sortBy]);

  const loadMore = () => {
    if (page < totalPages) {
      const next = page + 1;
      setPage(next);
      fetchMovies(next, true);
    }
  };

  return (
    <main className="min-h-screen bg-netflix-dark pt-24 pb-12">
      <Navbar />

      <div className="px-4 md:px-12 mt-4 max-w-[1600px] mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Movies</h1>

        {/* 🔥 PREMIUM FILTER BAR */}
        <div className="sticky top-20 z-40 mb-10">
          <div className="backdrop-blur-2xl bg-gradient-to-r from-black/40 via-black/30 to-black/40 
          border border-white/10 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.6)] px-6 py-5">

            <div className="flex flex-wrap items-end gap-6">

              {/* 🔹 SELECT STYLE */}
              {[
                {
                  label: "Genre",
                  value: selectedGenre,
                  onChange: setSelectedGenre,
                  options: [{ label: "All Genres", value: "" }, ...genres.map(g => ({ label: g.name, value: g.id }))]
                },
                {
                  label: "Year",
                  value: selectedYear,
                  onChange: setSelectedYear,
                  options: [{ label: "All Years", value: "" }, ...years.map(y => ({ label: y, value: y }))]
                },
                {
                  label: "Rating",
                  value: selectedRating,
                  onChange: setSelectedRating,
                  options: ratings
                },
                {
                  label: "Sort",
                  value: sortBy,
                  onChange: setSortBy,
                  options: sortOptions
                }
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-1 min-w-[160px] flex-1 sm:flex-none">
                  <label className="text-gray-400 text-[11px] uppercase tracking-wide">
                    {item.label}
                  </label>

                  <div className="relative">
                    <select
                      className="appearance-none w-full bg-gradient-to-b from-white/10 to-white/5 
                      backdrop-blur-xl text-white px-4 py-2 pr-10 rounded-xl  
                      border border-white/10 shadow-lg
                      hover:border-white/30 hover:bg-white/10
                      focus:outline-none focus:ring-2 focus:ring-white-500 focus:border-white-500
                    
                      transition duration-300 cursor-pointer"
                      value={item.value}
                      onChange={(e) => item.onChange(e.target.value)}
                    >
                      {item.options.map((opt: any, idx: number) => (
                        <option key={idx} value={opt.value} className="bg-black text-white">
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    {/* Arrow */}
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white/60 text-sm">
                      ▼
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>

        {/* MOVIES */}
        {loading && page === 1 ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-10 gap-x-4 md:gap-x-6">
              {movies.map((movie, index) => (
                <div key={`${movie.id}-${index}`}>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>

            {page < totalPages && (
              <div className="mt-16 mb-8 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded flex items-center gap-2 transition"
                >
                  {loadingMore && <Loader2 className="w-5 h-5 animate-spin" />}
                  {loadingMore ? 'Loading...' : 'Load More Movies'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-400 py-32 border border-white/5 bg-white/5 backdrop-blur-sm rounded-lg">
            <p className="text-2xl font-semibold text-white mb-2">No Movies Found</p>
            <p>Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </main>
  );
}