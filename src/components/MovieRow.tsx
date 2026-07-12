import React, { useEffect, useState, useRef } from 'react';
import type { Movie } from '../types';
import { fetchMovies } from '../lib/tmdb';
import { PosterCard } from './PosterCard';

interface Props {
  title: string;
  url: string;
  onMovieClick: (movie: Movie) => void;
}

export const MovieRow: React.FC<Props> = ({ title, url, onMovieClick }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMovies(url).then(setMovies);
  }, [url]);

  if (movies.length === 0) return null;

  return (
    <div className="movie-row">
      <h2 className="row-title">{title}</h2>
      <div className="row-posters" ref={scrollRef}>
        {movies.map(movie => (
          <PosterCard key={movie.id} movie={movie} onClick={onMovieClick} />
        ))}
      </div>
    </div>
  );
};
