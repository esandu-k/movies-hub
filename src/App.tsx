import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, categories } from './components/Sidebar';
import { HeroCarousel } from './components/HeroCarousel';
import { DetailsModal } from './components/DetailsModal';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { PosterCard } from './components/PosterCard';
import { endpoints, searchMovies, fetchMovies } from './lib/tmdb';
import type { Movie, User } from './types';
import './index.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);

  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [categoryUrl, setCategoryUrl] = useState(categories[0].url);
  const [categoryMovies, setCategoryMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('movieHubUser');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!isSearching) {
      fetchMovies(categoryUrl).then(setCategoryMovies);
    }
  }, [categoryUrl, isSearching]);

  const handleLogin = (username: string) => {
    const newUser = { id: Date.now(), username };
    setUser(newUser);
    localStorage.setItem('movieHubUser', JSON.stringify(newUser));
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('movieHubUser');
  };

  const handleSaveUsername = (username: string) => {
    if (user) {
      const updated = { ...user, username };
      setUser(updated);
      localStorage.setItem('movieHubUser', JSON.stringify(updated));
    }
    setShowSettingsModal(false);
  };

  const handleSearch = async (query: string) => {
    if (!query) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const results = await searchMovies(query);
    setSearchResults(results);
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleSelectCategory = (id: string, url: string) => {
    setSelectedCategory(id);
    setCategoryUrl(url);
    setIsSearching(false);
  };

  const handleGoHome = () => {
    handleSelectCategory(categories[0].id, categories[0].url);
  };

  const currentCategoryName = categories.find(c => c.id === selectedCategory)?.name || 'Movies';

  return (
    <div className="app-container">
      <Sidebar 
        selectedCategory={selectedCategory} 
        onSelectCategory={handleSelectCategory} 
        onGoHome={handleGoHome}
      />
      
      <div className="main-wrapper">
        <Navbar 
          user={user}
          isSearching={isSearching}
          onSearch={handleSearch}
          onLoginClick={() => setShowAuthModal(true)}
          onSettingsClick={() => setShowSettingsModal(true)}
          onLogoutClick={handleLogout}
        />

        {isSearching ? (
          <div className="search-results-section">
            <h2 className="section-title">Search Results</h2>
            {searchResults.length === 0 ? (
              <p style={{ padding: '0 4%', color: 'var(--gray-light)' }}>No results found.</p>
            ) : (
              <div className="category-grid">
                {searchResults.map(movie => (
                  <PosterCard key={movie.id} movie={movie} onClick={handleMovieClick} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <HeroCarousel url={endpoints.trending} onMovieClick={handleMovieClick} />
            
            <main className="main-content">
              <h2 className="section-title">{currentCategoryName}</h2>
              <div className="category-grid">
                {categoryMovies.map(movie => (
                  <PosterCard key={movie.id} movie={movie} onClick={handleMovieClick} />
                ))}
              </div>
            </main>
          </>
        )}
      </div>

      {selectedMovie && (
        <DetailsModal baseMovie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />
      )}
      {showSettingsModal && (
        <SettingsModal user={user} onClose={() => setShowSettingsModal(false)} onSaveUsername={handleSaveUsername} />
      )}
    </div>
  );
}

export default App;
