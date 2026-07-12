import React, { useState } from 'react';

interface Props {
  onClose: () => void;
  onLogin: (username: string) => void;
}

export const AuthModal: React.FC<Props> = ({ onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onLogin(email.split('@')[0]);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="login-box">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            className="form-input" 
            placeholder="Email or phone number" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            className="form-input" 
            placeholder="Password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p style={{ marginTop: '20px', color: 'var(--gray-light)', cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'New to Netflix? Sign up now.' : 'Already have an account? Sign in.'}
        </p>
      </div>
    </div>
  );
};
