export const getImageUrl = (path: string, size: 'original' | 'w780' | 'w500' = 'original') => {
  if (!path) return '/placeholder-movie.jpg'; // We can replace this with a local placeholder later
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
