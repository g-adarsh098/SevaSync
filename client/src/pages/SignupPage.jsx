import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Please enter your full name'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    setError('');
    setLoading(true);
    try {
      await signup(email, password, name.trim(), 'volunteer');
      navigate('/');
    } catch (err) {
      const code = err.code || '';
      if (code.includes('email-already')) {
        setError('This email is already registered. Try signing in instead.');
      } else if (code.includes('weak-password')) {
        setError('Password is too weak. Use at least 6 characters.');
      } else if (code.includes('invalid-email')) {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade">
        <h1 className="auth-logo"><span className="gradient-text">Seva</span>Sync</h1>
        <p className="auth-subtitle">Create your volunteer account</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSignup}>
          <div className="input-group">
            <label htmlFor="signup-name">Full Name</label>
            <input
              id="signup-name" type="text" className="input"
              placeholder="Your Full Name"
              value={name} onChange={e => setName(e.target.value)}
              required autoComplete="name"
            />
          </div>
          <div className="input-group">
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email" type="email" className="input"
              placeholder="your@email.com"
              value={email} onChange={e => setEmail(e.target.value)}
              required autoComplete="email"
            />
          </div>
          <div className="input-group">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password" type="password" className="input"
              placeholder="Min 6 characters"
              value={password} onChange={e => setPassword(e.target.value)}
              required autoComplete="new-password"
            />
          </div>
          <div className="input-group">
            <label htmlFor="signup-confirm">Confirm Password</label>
            <input
              id="signup-confirm" type="password" className="input"
              placeholder="Re-enter password"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              required autoComplete="new-password"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading} id="signup-submit">
            {loading ? <span className="spinner" style={{width:20,height:20}} /> : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
