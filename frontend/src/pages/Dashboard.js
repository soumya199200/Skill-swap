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
    <div className="page-shell">
      <div className="dashboard-shell">
        <section className="hero-panel panel-card">
          <span className="pill">Live learning exchange</span>
          <h1 className="page-title">Welcome to your Skill Swap dashboard.</h1>
          <p className="hero-meta">Signed in as {currentUser?.email}</p>
          <div className="nav-row">
            <Link className="nav-link" to="/skills">Browse Skills</Link>
            <Link className="nav-link" to="/skills">Create Skill</Link>
            <Link className="nav-link" to="/profile">My Profile</Link>
            <button className="secondary-button" onClick={handleLogout}>Logout</button>
          </div>
        </section>

        <section className="panel-card">
          <h2 className="section-heading">Available Skills</h2>
          <p className="section-subtitle">
            Explore what other learners and mentors are already sharing across the platform.
          </p>
          <div className="skills-grid" style={{ marginTop: '24px' }}>
            {skills.length === 0 ? (
              <p>No skills available yet.</p>
            ) : (
              skills.map((skill) => (
                <article className="skill-card" key={skill._id}>
                  <h3>{skill.title}</h3>
                  <p>{skill.description}</p>
                  <div className="skill-meta">
                    <span className="pill">Cost: {skill.creditsCost} credits</span>
                    <span className="pill">Category: {skill.category}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
