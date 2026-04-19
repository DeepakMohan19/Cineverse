import HeroBanner from "@/components/HeroBanner";
import Navbar from "../components/Navbar";
import MovieRow from "@/components/MovieRow";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-netflix-dark z-0 pb-12">
      <Navbar />
      <HeroBanner />
      <div className="pb-24 mt-10 md:mt-32 relative z-20 space-y-4">
        <MovieRow title="Trending Now" fetchUrl="/movies/trending" />
        <MovieRow title="Now Playing" fetchUrl="/movies/now_playing" />
        <MovieRow title="Upcoming" fetchUrl="/movies/upcoming" />
        <MovieRow title="Top Rated" fetchUrl="/movies/top_rated" />
        <MovieRow title="Korean" fetchUrl="/movies/language/ko" />
        <MovieRow title="Hindi" fetchUrl="/movies/language/hi" />
        <MovieRow title="Tamil" fetchUrl="/movies/language/ta" />
        <MovieRow title="Telugu" fetchUrl="/movies/language/te" />
        <MovieRow title="Malayalam" fetchUrl="/movies/language/ml" />
        <MovieRow title="Kannada" fetchUrl="/movies/language/kn" />

        
      </div>
    </main>
  );
}
