"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../hooks/useAuth';
import api from '../../lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser({ _id: data._id, name: data.name, email: data.email }, data.token);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-black relative flex flex-col items-center">
      <Navbar />
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://assets.nflxext.com/ffe/siteui/vlv3/93da5c27-be66-427c-8b72-5cb39d275279/94eb5ad7-10d8-4cca-bf45-ac52e0a052c0/IN-en-20240226-popsignuptwoweeks-perspective_alpha_website_large.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        >
          <source 
            src="https://assets.mixkit.co/videos/preview/mixkit-curtain-opening-in-a-movie-theater-4022-large.mp4" 
            type="video/mp4" 
          />
        </video>
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="z-10 bg-/50 backdrop-blur-lg p-12 mt-32 md:mt-40 w-full max-w-[450px] rounded-2xl border border-white/10 shadow-2xl">
        <h1 className="text-white text-3xl font-bold mb-7">Sign In</h1>
        {error && <p className="bg-[#e87c03] text-white p-3 rounded mb-4 text-sm">{error}</p>}
        
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <input 
            type="email" 
            placeholder="Email address"
            className="p-4 bg-[#333] text-white rounded outline-none focus:bg-[#454545] transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password"
            className="p-4 bg-[#333] text-white rounded outline-none focus:bg-[#454545] transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="bg-netflix-red text-white p-4 font-bold rounded mt-6 hover:bg-red-700 transition">
            Sign In
          </button>
        </form>

        <div className="mt-8 text-gray-400 text-sm">
          <span>New to Cineverse? </span>
          <Link href="/signup" className="text-white hover:underline font-semibold">
            Sign up now.
          </Link>
        </div>
      </div>
    </div>
  );
}
