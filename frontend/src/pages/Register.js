import React, { useState } from 'react';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { registerUser } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, email, password
      );
      await registerUser({
        name,
        email,
        firebaseUID: userCredential.user.uid,
        role
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-shell page-shell--centered">
      <div className="auth-card">
        <p className="auth-eyebrow">Get Started</p>
        <h1 className="auth-title">Create your learning exchange profile.</h1>
        <p className="auth-subtitle">
          Join as a student or mentor, then start sharing skills and earning credits.
        </p>
        <form className="auth-form" onSubmit={handleRegister}>
          {error && <p className="status-message status-message--error">{error}</p>}
        <input
          className="input-field"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <select
          className="select-field"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="mentor">Mentor</option>
        </select>
          <button className="primary-button" type="submit">Register</button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link className="text-link" to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
