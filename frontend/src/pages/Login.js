import React, { useState } from 'react';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password!');
    }
  };

  return (
    <div className="page-shell page-shell--centered">
      <div className="auth-card">
        <p className="auth-eyebrow">Skill Swap</p>
        <h1 className="auth-title">Trade what you know. Learn what you don't.</h1>
        <p className="auth-subtitle">
          Log in to continue building your profile, posting skills, and learning from the community.
        </p>
        <form className="auth-form" onSubmit={handleLogin}>
          {error && <p className="status-message status-message--error">{error}</p>}
        <input
          className="input-field"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input-field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
          <button className="primary-button" type="submit">Login</button>
        </form>
        <p className="auth-footer">
          Don&apos;t have an account? <Link className="text-link" to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
