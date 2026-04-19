"use client";
import { create } from 'zustand';
import api from '../lib/api';

interface WatchlistState {
  watchlist: string[];
  fetchWatchlist: () => Promise<void>;
  addToWatchlist: (movieId: number) => Promise<void>;
  removeFromWatchlist: (movieId: number) => Promise<void>;
}

export const useWatchlist = create<WatchlistState>((set, get) => ({
  watchlist: [],
  
  fetchWatchlist: async () => {
    try {
      const { data } = await api.get('/watchlist');
      set({ watchlist: data });
    } catch (error) {
      console.error('Failed to fetch watchlist', error);
    }
  },

  addToWatchlist: async (movieId) => {
    try {
      const { data } = await api.post('/watchlist', { movieId: movieId.toString() });
      set({ watchlist: data });
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to add to watchlist';
      console.error('Watchlist Error:', message);
      throw new Error(message); // Re-throw to allow component level error handling if needed
    }
  },

  removeFromWatchlist: async (movieId) => {
    try {
      const { data } = await api.delete(`/watchlist/${movieId}`);
      set({ watchlist: data });
    } catch (error) {
      console.error('Failed to remove from watchlist', error);
    }
  },
}));
