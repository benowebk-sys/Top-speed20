import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/api';
import '../styles/auth.css';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authService.login(email, password);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      {Array.from({ length: 200 }).map((_, i) => (
        <span key={i} />
      ))}

      <div className="signin">
        <div className="content">
          <h2>Sign In</h2>
          <div className="form">
            <form onSubmit={handleLogin}>
              <div className="inputBx">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <i>Email</i>
              </div>
              <div className="inputBx">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <i>Password</i>
              </div>

              {error && <div className="error-box">{error}</div>}

              <div className="inputBx">
                <input type="submit" value={loading ? 'Logging in...' : 'Login'} />
              </div>
            </form>

            <div className="links">
              <Link to="/forgot-password">Forgot Password</Link>
              <Link to="/signup">Signup</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
