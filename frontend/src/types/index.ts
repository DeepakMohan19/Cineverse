export interface Movie {
  id: number;
  title: string;
  original_title: string;
  name?: string; // For TV shows
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  vote_count?: number;
  genres?: { id: number; name: string }[];
  spoken_languages?: { english_name: string; name: string }[];
  credits?: {
    cast: { id: number; name: string; character: string }[];
    crew: { id: number; name: string; job: string }[];
  };
  images?: {
    logos: { file_path: string }[];
  };
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}
