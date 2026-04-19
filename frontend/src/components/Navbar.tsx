"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Bell, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

/**
 * Global Navbar Component
 * Handles navigation and search functionality.
 */
export default function Navbar({ onSearch }: NavbarProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Handle transparent to solid background transition on scroll
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debounced search logic for in-page search (like the search page)
  useEffect(() => {
    if (onSearch) {
      const delay = setTimeout(() => {
        onSearch(query);
      }, 400);
      return () => clearTimeout(delay);
    }
  }, [query, onSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !onSearch) {
      // If we are not on the search page, redirect to it
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/100 backdrop-blur-md shadow-lg" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="flex items-center px-4 md:px-2 py-2 justify-between max-w-7xl mx-auto">
        
        {/* LEFT SECTION: Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter">
              Cine<span className="text-red-600 group-hover:text-red-500 transition-colors">VERSE</span>
            </h1>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-300">
             <Link href="/" className={`hover:text-white transition-colors ${pathname === '/' ? 'text-white' : ''}`}>Home</Link>
             <Link href="/movies" className={`hover:text-white transition-colors ${pathname === '/movies' ? 'text-white' : ''}`}>Movies</Link>
             <Link href="/watchlist" className={`hover:text-white transition-colors ${pathname === '/watchlist' ? 'text-white' : ''}`}>Watchlist</Link>
          </nav>
        </div>

        {/* RIGHT SECTION: Search, Notifications & Profile */}
        <div className="flex items-center gap-4 text-white">
          
          {/* SEARCH BAR */}
          <div className="flex items-center relative">
            <form 
              onSubmit={handleSearchSubmit}
              className={`flex items-center transition-all duration-500 ease-in-out border rounded overflow-hidden ${
                showSearch 
                  ? "w-48 md:w-72 border-gray-500 bg-black/80 px-3 py-1.5 opacity-100" 
                  : "w-0 border-transparent opacity-0"
              }`}
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Movies, actors, genres..."
                className="bg-transparent text-sm w-full outline-none placeholder:text-gray-500"
                autoFocus={showSearch}
              />
            </form>
            <button 
              type="button"
              onClick={() => {
                if (!showSearch) {
                  setShowSearch(true);
                } else if (!query) {
                  setShowSearch(false);
                } else {
                  // If there is a query, clicking again performs search redirect if needed
                  if (!onSearch) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                }
              }}
              className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-95"
              aria-label="Toggle Search"
            >
              <Search className="w-5 h-5 cursor-pointer" />
            </button>
          </div>

          {/* NOTIFICATIONS */}
          <button className="p-2 hover:bg-white/10 rounded-full transition-all hidden sm:block">
            <Bell className="w-5 h-5" />
          </button>
          
          {/* PROFILE */}
          <Link 
            href="/login" 
            className="p-2 hover:bg-white/10 rounded-full transition-all flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-[#8B4513] rounded-full flex items-center justify-center font-bold text-md uppercase text-white">
              {mounted && user?.name ? user.name.charAt(0) : "U"}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}