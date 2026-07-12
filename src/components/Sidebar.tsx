import { Flame, Star, Zap, Smile, Ghost, Heart, Film, X } from 'lucide-react';
import { endpoints } from '../lib/tmdb';

export const categories = [
  { id: 'trending', name: 'Trending Now', url: endpoints.trending, icon: Flame },
  { id: 'originals', name: 'Originals', url: endpoints.originals, icon: Star },
  { id: 'action', name: 'Action', url: endpoints.action, icon: Zap },
  { id: 'comedy', name: 'Comedy', url: endpoints.comedy, icon: Smile },
  { id: 'horror', name: 'Horror', url: endpoints.horror, icon: Ghost },
  { id: 'romance', name: 'Romance', url: endpoints.romance, icon: Heart },
  { id: 'documentaries', name: 'Documentaries', url: endpoints.documentaries, icon: Film },
];

interface Props {
  selectedCategory: string;
  onSelectCategory: (id: string, url: string) => void;
  onGoHome: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ selectedCategory, onSelectCategory, onGoHome, isOpen, onClose }: Props) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo" onClick={onGoHome} style={{ cursor: 'pointer' }}>
        <span>MOVIE HUB</span>
        <span className="by-kule">by Kule</span>
      </div>
      
      <button className="close-sidebar-btn icon-btn" onClick={onClose}>
        <X size={24} />
      </button>
      
      <div className="sidebar-nav">
        <h3 className="sidebar-heading">Sort & Filter</h3>
        <ul>
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <li 
                key={cat.id} 
                className={`sidebar-item ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat.id, cat.url)}
              >
                <Icon size={18} />
                <span>{cat.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};
