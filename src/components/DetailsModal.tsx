import React, { useEffect, useState } from 'react';
import type { DetailedMovie } from '../types';
import { fetchMovieDetails, TMDB_BACKDROP_BASE_URL, TMDB_IMAGE_BASE_URL } from '../lib/tmdb';
import { WatchProviders } from './WatchProviders';

interface Props {
  baseMovie: DetailedMovie | any;
  onClose: () => void;
}

export const DetailsModal: React.FC<Props> = ({ baseMovie, onClose }) => {
  const [movie, setMovie] = useState<DetailedMovie | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (baseMovie) {
      setError(false);
      const type = baseMovie.media_type || (baseMovie.name || baseMovie.first_air_date ? 'tv' : 'movie');
      fetchMovieDetails(baseMovie.id, type as 'movie' | 'tv').then(data => {
        if (!data || (data as any).success === false) {
          setError(true);
          setMovie(null);
        } else {
          setMovie(data);
        }
      });
    } else {
      setMovie(null);
    }
  }, [baseMovie]);

  if (!baseMovie) return null;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="details-container">
        <button className="close-btn" onClick={onClose} style={{ zIndex: 10 }}>&times;</button>
        
        {!movie && !error && (
          <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
        )}
        {error && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--primary-red)' }}>
            Error loading details. Please try again.
          </div>
        )}
        {movie && !error && (
          <>
            <div className="details-hero" style={{ backgroundImage: `url('${TMDB_BACKDROP_BASE_URL}${movie.backdrop_path}')` }}>
              <div className="details-hero-overlay"></div>
              <div className="details-hero-content">
                <h2>{movie.title || movie.name}</h2>
                <div className="details-meta">
                  <span className="rating">{Math.round((movie.vote_average || 0) * 10)}% Match</span>
                  <span>{movie.release_date?.substring(0, 4) || movie.first_air_date?.substring(0, 4)}</span>
                  <span>
                    {movie.runtime 
                      ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` 
                      : (movie.episode_run_time?.[0] ? `${movie.episode_run_time[0]}m` : 'N/A')
                    }
                  </span>
                  <span style={{ border: '1px solid #fff', padding: '0 5px', fontSize: '0.9rem', borderRadius: '3px' }}>HD</span>
                </div>
                <div className="details-buttons">
                  <button className="btn btn-primary" onClick={() => alert('Play functionality coming soon!')}>Play</button>
                  <button className="btn btn-secondary">My List</button>
                </div>
              </div>
            </div>

            <div className="details-info">
              <div className="left-col">
                <p>{movie.overview}</p>
                
                {movie.credits?.cast && movie.credits.cast.length > 0 && (
                  <div className="mt-20">
                    <h3>Cast</h3>
                    <div className="cast-list">
                      {movie.credits.cast.slice(0, 8).map((c, i) => (
                        <div key={i} className="cast-item">
                          {c.profile_path ? (
                            <img src={`${TMDB_IMAGE_BASE_URL}${c.profile_path}`} className="cast-img" alt={c.name} />
                          ) : (
                            <div className="cast-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>?</div>
                          )}
                          <div className="cast-name">{c.name}</div>
                          <div className="cast-char">{c.character}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {movie['watch/providers']?.results?.['US'] && (
                  <WatchProviders providers={movie['watch/providers'].results['US']} />
                )}
                
                {movie.reviews?.results && movie.reviews.results.length > 0 && (
                  <div className="mt-20">
                    <h3>Reviews</h3>
                    {movie.reviews.results.slice(0, 2).map((r, i) => (
                      <div key={i} className="review-card">
                        <div className="review-author">A review by {r.author}</div>
                        <div className="review-content">{r.content}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="right-col">
                <div className="mb-20 details-crew">
                  <span>Genres:</span> {movie.genres?.map(g => g.name).join(', ') || 'N/A'}
                </div>
                <div className="mb-20 details-crew">
                  <span>Director:</span> {movie.credits?.crew?.find(c => c.job === 'Director')?.name || 'N/A'}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
