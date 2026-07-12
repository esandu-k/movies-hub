import React, { useState } from 'react';
import type { User } from '../types';

interface Props {
  user: User | null;
  onClose: () => void;
  onSaveUsername: (newUsername: string) => void;
}

export const SettingsModal: React.FC<Props> = ({ user, onClose, onSaveUsername }) => {
  const [username, setUsername] = useState(user?.username || '');

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="settings-box">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Settings</h2>
        
        <div className="settings-group">
          <label>Username</label>
          <div className="input-group">
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              placeholder="Change username" 
            />
            <button className="btn btn-primary" onClick={() => onSaveUsername(username)}>Save</button>
          </div>
        </div>

        <div className="settings-group">
          <label>Email</label>
          <input type="email" className="form-input" placeholder="Update email address" />
        </div>

        <div className="settings-group">
          <label>Language</label>
          <select className="form-input">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>

        <div className="settings-group checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <input type="checkbox" id="settings-autoplay" defaultChecked />
          <label htmlFor="settings-autoplay">Autoplay trailers</label>
        </div>
        
        <div className="settings-group checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <input type="checkbox" id="settings-notifications" />
          <label htmlFor="settings-notifications">Email notifications for new releases</label>
        </div>
      </div>
    </div>
  );
};
