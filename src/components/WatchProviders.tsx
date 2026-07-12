import React from 'react';
import type { Provider } from '../types';
import { TMDB_IMAGE_BASE_URL } from '../lib/tmdb';

interface Props {
  providers?: {
    link?: string;
    flatrate?: Provider[];
    rent?: Provider[];
    buy?: Provider[];
  };
}

export const WatchProviders: React.FC<Props> = ({ providers }) => {
  if (!providers) return null;

  const renderSection = (title: string, items?: Provider[]) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-20">
        <h4 style={{ fontSize: '0.9rem', color: 'var(--gray-light)', marginBottom: '10px' }}>{title}</h4>
        <div className="providers-list">
          {items.map(p => (
            <img 
              key={p.provider_id} 
              src={TMDB_IMAGE_BASE_URL + p.logo_path} 
              alt={p.provider_name} 
              title={p.provider_name}
              className="provider-logo"
            />
          ))}
        </div>
      </div>
    );
  };

  const hasAny = providers.flatrate?.length || providers.rent?.length || providers.buy?.length;
  if (!hasAny) return null;

  return (
    <div className="watch-providers-container mt-20">
      <h3 className="mb-20">Watch Now</h3>
      {renderSection('Stream', providers.flatrate)}
      {renderSection('Rent', providers.rent)}
      {renderSection('Buy', providers.buy)}
      {providers.link && (
        <a 
          href={providers.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: 'var(--primary-red)', fontSize: '0.9rem', textDecoration: 'none' }}
        >
          View all options on JustWatch
        </a>
      )}
    </div>
  );
};
