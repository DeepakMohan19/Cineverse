"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { getImageUrl } from '../lib/tmdb';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onRemove?: (id: number) => void;
}

export default function MovieCard({ movie, onRemove }: MovieCardProps) {
  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemove) {
      onRemove(movie.id);
    }
  };

  return (
    <div className="relative group">
      <Link href={`/movie/${movie.id}`}>
        <div className="relative h-40 min-w-[100px] md:h-72 md:min-w-[192px] cursor-pointer transition transform duration-300 hover:scale-105 overflow-hidden rounded">
          <Image
            src={getImageUrl(movie.poster_path || movie.backdrop_path, 'w500')}
            alt={movie.name || movie.title || 'Movie Poster'}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <p className="text-white font-semibold text-sm md:text-base line-clamp-2 md:line-clamp-1">{movie.title || movie.name}</p>
            <div className="flex gap-2 items-center text-xs text-gray-300 mt-1">
              <span className="text-green-500 font-bold">{Math.round(movie.vote_average * 10)}% Match</span>
              <span>{movie.release_date?.slice(0, 4) || movie.first_air_date?.slice(0, 4)}</span>
            </div>
          </div>
        </div>
      </Link>
      
      {onRemove && (
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 z-20 p-2 bg-black/50 hover:bg-red-600 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm border border-white/20"
          title="Remove from watchlist"
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
}
