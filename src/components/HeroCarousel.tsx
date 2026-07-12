import React, { useEffect, useState, useRef } from 'react';
import type { Movie } from '../types';
import { TMDB_BACKDROP_BASE_URL, fetchMovies } from '../lib/tmdb';
import { Play, Info } from 'lucide-react';

interface Props {
  url: string;
  onMovieClick: (movie: Movie) => void;
}

export const HeroCarousel: React.FC<Props> = ({ url, onMovieClick }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetchMovies(url).then(res => setMovies(res.slice(0, 5)));
  }, [url]);

  const startAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % Math.max(movies.length, 1));
    }, 5000);
  };

  useEffect(() => {
    if (movies.length > 0) {
      startAutoPlay();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [movies]);

  if (movies.length === 0) {
    return (
      <section className="hero" id="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Loading...</h1>
          <p className="hero-overview">Please wait while we fetch the hottest movie...</p>
        </div>
      </section>
    );
  }

  const movie = movies[currentIndex];
  const bgImage = movie.backdrop_path ? `${TMDB_BACKDROP_BASE_URL}${movie.backdrop_path}` : '';

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    startAutoPlay();
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
    startAutoPlay();
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    startAutoPlay();
  };

  return (
    <section className="hero" id="hero-section" style={{ backgroundImage: bgImage ? `url('${bgImage}')` : 'none' }}>
      <div className="hero-overlay"></div>
      
      <button className="hero-arrow left-arrow" onClick={handlePrev}>&lt;</button>
      <button className="hero-arrow right-arrow" onClick={handleNext}>&gt;</button>
      
      <div className="hero-content">
        <h1 className="hero-title">{movie.title || movie.name}</h1>
        <p className="hero-overview">{movie.overview}</p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={() => onMovieClick(movie)}>
            <Play size={20} /> Play
          </button>
          <button className="btn btn-secondary" onClick={() => onMovieClick(movie)}>
            <Info size={20} /> More Info
          </button>
        </div>
      </div>
      
      <div className="hero-dots">
        {movies.map((_, i) => (
          <div 
            key={i} 
            className={`hero-dot ${i === currentIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(i)}
          />
        ))}
      </div>
    </section>
  );
};
