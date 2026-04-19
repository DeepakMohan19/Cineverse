"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Plus, Check } from 'lucide-react';
import { useWatchlist } from '../hooks/useWatchlist';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Movie } from '../types';
import api from '../lib/api';
import { getImageUrl } from '../lib/tmdb';

export default function HeroBanner() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await api.get('/movies/trending');
        // Fetch top 5 movies for the carousel
        const topMovies = data.results.slice(0, 5);
        const promises = topMovies.map((m: any) => api.get(`/movies/${m.id}`));
        const responses = await Promise.all(promises);
        setMovies(responses.map(r => r.data));
      } catch (error) {
        console.error('Failed to fetch for banner', error);
      }
    }
    fetchData();
  }, []);


useEffect(() => {
  if (!movies || movies.length === 0) return;

  const interval = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  }, 4000); // 4 sec

  return () => clearInterval(interval);
}, [movies]);

  if (movies.length === 0) return <div className="h-[65vh] w-full bg-black flex items-center justify-center animate-pulse" />;

  const movie = movies[currentIndex];

  return (
    <div className="relative h-[100vh] md:h-[85vh] w-full z-0 pointer-events-none md:pointer-events-auto">
      {/* Background Image corresponding to active banner */}
      <div className="absolute top-0 left-0 h-[100vh] md:h-[100vh] w-full -z-10 transition-all duration-700 ease-in-out">
        <Image
          key={movie.id}
          src={getImageUrl(movie.backdrop_path || movie.poster_path, 'original')}
          alt={movie.title || movie.name || 'Banner'}
          layout="fill"
          objectFit="cover"
          priority
          className="animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="absolute top-[50%] md:top-[50%] ml-4 md:ml-12 max-w-xl z-20">
        <div key={`logo-${movie.id}`} className="animate-fade-in">
          {movie.images?.logos && movie.images.logos.length > 0 ? (
            <div className="relative h-24 md:h-36 lg:h-48 w-[250px] md:w-[400px] lg:w-[500px] mb-6">
              <Image 
                src={getImageUrl(movie.images.logos[0].file_path, 'original')} 
                alt={`${movie.title || movie.name} logo`}
                layout="fill"
                objectFit="contain"
                className="drop-shadow-2xl"
                style={{ objectPosition: 'left bottom' }}
              />
            </div>
          ) : (
            <div className="h-24 md:h-36 lg:h-48 w-[250px] md:w-[400px] lg:w-[500px] mb-6 bg-gray-600/30 rounded-lg animate-pulse backdrop-blur-sm shadow-xl border border-white/5" />
          )}
          <p className="max-w-xs text-xs md:max-w-lg md:text-lg mb-8 text-shadow-md line-clamp-3 text-gray-200">
            {movie.overview}
          </p>
        </div>

        <div className="flex space-x-3 pointer-events-auto">
          <Link href={`/movie/${movie.id}`}>
            <button className="flex items-center gap-2 rounded bg-white px-5 py-2 md:px-8 md:py-3 text-sm md:text-xl font-bold text-black transition hover:bg-white/80">
              <Play className="h-5 w-5 md:h-7 md:w-7 text-black fill-black" />
              Play
            </button>
          </Link>
          <button 
            onClick={() => {
              if (!user) {
                router.push('/login');
                return;
              }
              if (watchlist.includes(movie.id.toString())) {
                removeFromWatchlist(movie.id);
              } else {
                addToWatchlist(movie.id);
              }
            }}
            className="flex items-center gap-2 rounded bg-gray-500/70 px-5 py-2 md:px-8 md:py-3 text-sm md:text-xl text-white font-semibold transition hover:bg-gray-500/90"
          >
            {watchlist.includes(movie.id.toString()) ? (
              <>
                <Check className="h-5 w-5 md:h-7 md:w-7" />
                Watchlisted
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 md:h-7 md:w-7" />
                Watchlist
              </>
            )}
          </button>
        </div>
      </div>

      {/* Pagination Dots (Bottom Center) */}
      <div className="absolute bottom-1 md:bottom-2 left-270 right-0 flex justify-center items-center gap-2 z-30 pointer-events-auto">
        {movies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ease-in-out cursor-pointer ${
              currentIndex === idx 
                ? 'w-6 bg-white scale-110' 
                : 'w-2 bg-gray-500 hover:bg-gray-300'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
