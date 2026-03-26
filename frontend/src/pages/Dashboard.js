import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSkills } from '../services/api';
import { auth } from '../config/firebase';
import { useNavigate, Link } from 'react-router-dom';

function Dashboard() {
  const { currentUser } = useAuth();
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    getSkills().then(res => setSkills(res.data));
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to Skill Swap Dashboard!</h1>
      <p>Logged in as: {currentUser?.email}</p>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/skills" style={{ marginRight: '15px' }}>Browse Skills</Link>
        <Link to="/profile" style={{ marginRight: '15px' }}>My Profile</Link>
        <button onClick={handleLogout}>Logout</button>
      </nav>
      <h2>Available Skills</h2>
      {skills.length === 0 ? (
        <p>No skills available yet!</p>
      ) : (
        skills.map(skill => (
          <div key={skill._id} style={{
            border: '1px solid #ccc',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px'
          }}>
            <h3>{skill.title}</h3>
            <p>{skill.description}</p>
            <p>Cost: {skill.creditsCost} credits</p>
            <p>Category: {skill.category}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;