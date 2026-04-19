"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Plus, Check, PlayCircle, Star, PlayIcon } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import api from '../../../lib/api';
import { getImageUrl } from '../../../lib/tmdb';
import { Movie, Video } from '../../../types';
import { useWatchlist } from '../../../hooks/useWatchlist';
import { useAuth } from '../../../hooks/useAuth';
import { Play } from 'next/font/google';

export default function MovieDetails() {
  const params = useParams();
  const id = params.id as string;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { watchlist, addToWatchlist, removeFromWatchlist, fetchWatchlist } = useWatchlist();
  const { user } = useAuth();
  
  const inWatchlist = watchlist.includes(id);
const centerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (user) {
      fetchWatchlist();
    }
  }, [user, fetchWatchlist]);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const [movieRes, videosRes] = await Promise.all([
          api.get(`/movies/${id}`),
          api.get(`/movies/${id}/videos`)
        ]);
        
        setMovie(movieRes.data);
        
        const videos = videosRes.data.results as Video[];
        if (videos.length > 0) {
          setTrailerKey(videos[0].key);
        }
      } catch (error) {
        console.error('Failed to fetch movie details', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (id) fetchDetails();
  }, [id]);

  const handleWatchlist = () => {
    if (!user) return alert("Please sign in to add to your watchlist!");
    if (inWatchlist) {
      removeFromWatchlist(Number(id));
    } else {
      addToWatchlist(Number(id));
    }
  };

  if (loading) return <div className="min-h-screen bg-netflix-dark flex items-center justify-center animate-pulse"><div className="w-16 h-16 border-4 border-netflix-red rounded-full border-t-transparent animate-spin"/></div>;
  if (!movie) return <div className="min-h-screen bg-netflix-dark text-white text-center pt-24 text-2xl">Movie not found.</div>;

  return (
    <main className="min-h-screen bg-netflix-dark overflow-x-hidden pt-20">
      <Navbar />
 <div className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
        {/* Background Layer: Video or Image Fallback */}
        <div className="absolute w-full h-[110vh] top-[-10vh]">
          {trailerKey ? (
            <div className="relative w-full h-full pointer-events-none scale-125 md:scale-110">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&loop=1&playlist=${trailerKey}&controls=0&modestbranding=1&rel=0&iv_load_policy=3&enablejsapi=1`}
                title="Background Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
          ) : (
            <Image
              src={getImageUrl(movie.backdrop_path || movie.poster_path, 'original')}
              alt={movie.title || "Backdrop"}
              fill
              className="object-cover opacity-50"
              priority
            />
          )}
          {/* Gradients to blend video into UI */}
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark via-netflix-dark/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-netflix-dark via-transparent to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-center h-full px-4 md:px-12 pt-20">
          <div className="max-w-3xl space-y-6">
             {/* Logo or Title */}
             <h1 className="text-4xl md:text-7xl font-extrabold text-white drop-shadow-2xl">
              {movie.title || movie.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm md:text-lg font-bold">
              <span className="text-green-500">{Math.round((movie.vote_average || 0) * 10)}% Match</span>
              <span className="text-gray-300">{movie.release_date?.slice(0, 4)}</span>
              <span className="border border-gray-500 px-2 rounded text-xs text-gray-400">HD</span>
              <div className="flex items-center gap-1 text-yellow-500">
                 <Star className="w-4 h-4 fill-current" />
                 <span>{movie.vote_average?.toFixed(1)}</span>
              </div>
            </div>

            <p className="text-gray-200 text-sm md:text-xl line-clamp-3 md:line-clamp-4 max-w-2xl drop-shadow-lg">
              {movie.overview}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
             <button
  onClick={() => {
    window.scrollTo({
     top: 700,
     behavior: "smooth",
    });
  }}
  className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-md font-bold hover:bg-white/90 transition shadow-xl"
>
  <PlayIcon className="w-6 h-6 fill-current" />
  Play Trailer
</button>
              
              <button 
                onClick={handleWatchlist}
                className={`flex items-center gap-2 px-8 py-3 rounded-md font-bold transition shadow-xl backdrop-blur-md border border-white/20 ${
                  inWatchlist ? 'bg-green/20 text-white' : 'bg-gray-500/40 text-white hover:bg-gray-500/60'
                }`}
              >
                {inWatchlist ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div ref={centerRef} className="relative w-full z-10 px-4 md:px-12 mt-12 mb-16">
        <div className="flex flex-col xl:flex-row gap-8 xl:gap-12 bg-[#181818] rounded-xl overflow-hidden shadow-2xl p-6 md:p-10 border border-white/5">
          
          {/* Left Side: Trailer Embed */}
          <div className="w-full xl:w-2/3 h-[300px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden shrink-0 shadow-lg relative bg-black flex items-center justify-center">
            {trailerKey ? (
              <iframe
                className="w-full h-[300px] md:h-[450px] lg:h-[500px] absolute "
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=0&rel=0&showinfo=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="text-gray-500 flex flex-col items-center">
                <PlayCircle className="w-16 h-16 mb-4 opacity-50" />
                <p>No Official Trailer Available</p>
              </div>
            )}
          </div>

          {/* Right Side: Metadata Panel */}
<div className="w-full xl:w-[32%] flex flex-col justify-center pl-6 xl:pl-10">

  {/* Title */}
  <h1 className="text-3xl md:text-4xl font-semibold text-white leading-snug tracking-tight mb-4">
    {movie.title || movie.name || movie.original_title}
  </h1>

  {/* Rating + Meta */}
  <div className="flex items-center flex-wrap gap-3 text-sm text-gray-300 mb-6">

    <div className="flex items-center gap-1 text-yellow-400 font-semibold text-base">
      ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
    </div>

    <span className="text-gray-400 text-xs">
      {movie.vote_count ? `(${movie.vote_count.toLocaleString()} votes)` : ''}
    </span>

    <span className="bg-white/10 px-2.5 py-1 rounded-md text-xs text-white">
      {movie.release_date?.slice(0, 4) || movie.first_air_date?.slice(0, 4)}
    </span>

    <span className="border border-gray-600 px-2.5 py-1 rounded-md text-xs text-gray-300">
      HD
    </span>

  </div>

  {/* Info Section */}
  <div className="space-y-3 text-sm mb-8">

    <div className="flex ">
      <span className="w-24 text-gray-500 font-semibold">Genres :</span>
      <span className="text-white">
        {movie.genres?.map(g => g.name).join(', ') || 'N/A'}
      </span>
    </div>

    <div className="flex">
      <span className="w-24 text-gray-500 font-semibold">Language :</span>
      <span className="text-white">
        {movie.spoken_languages?.map(l => l.english_name).join(', ') || 'N/A'}
      </span>
    </div>

    <div className="flex">
      <span className="w-24 text-gray-500 font-semibold">Director :</span>
      <span className="text-white">
        {movie.credits?.crew?.find(c => c.job === 'Director')?.name || 'N/A'}
      </span>
    </div>

    <div className="flex">
      <span className="w-24 text-gray-500 font-semibold">Music :</span>
      <span className="text-white">
        {movie.credits?.crew?.find(
          c => c.job === 'Original Music Composer' || c.job === 'Music'
        )?.name || 'N/A'}
      </span>
    </div>

    <div className="flex">
      <span className="w-24 text-gray-500 font-semibold">Cast :</span>
      <span className="text-white line-clamp-2 text-sm ">
        {movie.credits?.cast?.slice(0, 5).map(c => c.name).join(', ') || 'N/A'}
      </span>
    </div>

  </div>

  {/* Button */}
  <div className="mt-2">
    <button
      onClick={handleWatchlist}
      className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-base transition-all duration-300 ${
        inWatchlist
          ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
          : 'bg-green-500 text-black hover:bg-gray-200'
      }`}
    >
      {inWatchlist ? (
        <>
          <Check className="w-5 h-5" />
          In Watchlist
        </>
      ) : (
        <>
          <Plus className="w-5 h-5" />
          Add to Watchlist
        </>
      )}
    </button>
  </div>

</div>
        </div>
      </div>
    </main>
  );
}
