"use client";

import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../types';
import MovieCard from './MovieCard';
import api from '../lib/api';

interface MovieRowProps {
  title: string;
  fetchUrl: string;
}

export default function MovieRow({ title, fetchUrl }: MovieRowProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isMoved, setIsMoved] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await api.get(fetchUrl);
        setMovies(data.results);
      } catch (error) {
        console.error('Failed to fetch movies for row', error);
      }
    }
    fetchData();
  }, [fetchUrl]);

  const handleClick = (direction: 'left' | 'right') => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-40 md:h-80 space-y-0.5 md:space-y-2 px-4 md:px-12 relative z-10 w-full mb-8">
      <h2 className="w-56 cursor-pointer text-sm font-semibold text-[#e5e5e5] transition duration-200 hover:text-white md:text-xl md:font-bold">
        {title}
      </h2>
      <div className="group relative">
        <ChevronLeft
          className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 bg-black/60 rounded-full ${!isMoved && 'hidden'}`}
          onClick={() => handleClick('left')}
        />
        <div 
          ref={rowRef}
          className="flex items-center space-x-2 overflow-x-scroll md:space-x-4 md:p-2 scrollbar-hide"
        >
          {movies.map((movie) => (
            movie.poster_path || movie.backdrop_path ? (
              <MovieCard key={movie.id} movie={movie} />
            ) : null
          ))}
        </div>
        <ChevronRight
          className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 bg-black/60 rounded-full"
          onClick={() => handleClick('right')}
        />
      </div>
    </div>
  );
}
