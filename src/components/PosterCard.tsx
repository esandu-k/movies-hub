import React from 'react';
import type { Movie } from '../types';
import { TMDB_IMAGE_BASE_URL } from '../lib/tmdb';

interface Props {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

export const PosterCard: React.FC<Props> = ({ movie, onClick }) => {
  const imagePath = movie.backdrop_path || movie.poster_path;
  if (!imagePath) return null;

  const imageUrl = TMDB_IMAGE_BASE_URL + imagePath;
  let displayTitle = movie.title || movie.name || '';
  const year = (movie.release_date || movie.first_air_date || '').substring(0, 4);
  if (year) displayTitle += ` (${year})`;

  return (
    <div 
      className="poster-card" 
      style={{ backgroundImage: `url('${imageUrl}')` }}
      onClick={() => onClick(movie)}
    >
      <div className="poster-info">
        <span className="poster-title">{displayTitle}</span>
        <div className="poster-actions">
          <button className="poster-btn info">ℹ️ Details</button>
        </div>
      </div>
      <div className="persistent-title">{displayTitle}</div>
    </div>
  );
};
