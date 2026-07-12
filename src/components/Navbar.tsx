import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import type { User } from '../types';

interface Props {
  user: User | null;
  onSearch: (query: string) => void;
  onLoginClick: () => void;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
  isSearching: boolean;
}

export const Navbar: React.FC<Props> = ({ user, onSearch, onLoginClick, onSettingsClick, onLogoutClick, isSearching }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchActive, setSearchActive] = useState(isSearching);
  const [query, setQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setSearchActive(isSearching);
    if (!isSearching) setQuery('');
  }, [isSearching]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  const getInitial = (name: string) => (name ? name.charAt(0).toUpperCase() : 'U');

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-actions" style={{ marginLeft: 'auto', width: '100%', justifyContent: 'flex-end' }}>
        <div className={`search-box ${searchActive ? 'active' : ''}`}>
          <button className="icon-btn" onClick={() => setSearchActive(!searchActive)}>
            <Search size={20} />
          </button>
          <input 
            type="text" 
            placeholder="Titles, people, genres" 
            value={query}
            onChange={handleSearchChange}
            onBlur={() => { if (!query) setSearchActive(false); }}
          />
        </div>

        {user ? (
          <div className="profile-dropdown-container">
            <div className="profile-menu" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {getInitial(user.username)}
            </div>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-username">{user.username}</div>
                <hr />
                <button className="dropdown-btn" onClick={() => { setDropdownOpen(false); onSettingsClick(); }}>Settings</button>
                <button className="dropdown-btn" onClick={() => { setDropdownOpen(false); onLogoutClick(); }}>Sign out</button>
              </div>
            )}
          </div>
        ) : (
          <button className="btn btn-primary" onClick={onLoginClick}>Sign In</button>
        )}
      </div>
    </nav>
  );
};
