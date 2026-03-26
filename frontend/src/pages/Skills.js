import React, { useState, useEffect } from 'react';
import { getSkills, createSkill, getUserByFirebaseUID } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Skills() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creditsCost, setCreditsCost] = useState('');
  const [category, setCategory] = useState('technology');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    loadSkills();
    loadCurrentProfile();
  }, [currentUser, navigate]);

  const loadSkills = async () => {
    try {
      const res = await getSkills();
      setSkills(res.data);
    } catch (err) {
      setError('Unable to load skills right now.');
    }
  };

  const loadCurrentProfile = async () => {
    try {
      const res = await getUserByFirebaseUID(currentUser.uid);
      setCurrentProfile(res.data);
    } catch (err) {
      setError('Unable to load your profile right now.');
    }
  };

  const handleCreateSkill = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!title.trim() || !description.trim() || !creditsCost) {
      setError('Please fill in all fields before posting a skill.');
      return;
    }

    if (!currentProfile?._id) {
      setError('Your profile is still loading. Please try again in a moment.');
      return;
    }

    try {
      setIsSubmitting(true);
      await createSkill({
        title: title.trim(),
        description: description.trim(),
        creditsCost: Number(creditsCost),
        teacher: currentProfile._id,
        category
      });
      await loadSkills();
      setTitle('');
      setDescription('');
      setCreditsCost('');
      setCategory('technology');
      setSuccessMessage('Skill posted successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create skill.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="content-shell grid-layout grid-layout--sidebar">
        <section className="panel-card">
          <h1 className="page-title">Skills Marketplace</h1>
          <p className="page-subtitle">
            Share what you know, browse active listings, and keep the learning momentum going.
          </p>
          <div className="nav-row">
            <Link className="nav-link" to="/dashboard">Back to Dashboard</Link>
            <Link className="nav-link" to="/profile">My Profile</Link>
          </div>

          <h2 className="section-heading" style={{ marginTop: '28px' }}>All Skills</h2>
          <div className="skills-grid">
            {skills.length === 0 ? (
              <div className="skill-card">
                <h3>No skills yet</h3>
                <p>Be the first to post something valuable for the community.</p>
              </div>
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

        <aside className="form-card">
          <span className="pill">New Listing</span>
          <h2 className="section-heading" style={{ marginTop: '16px' }}>Post a skill</h2>
          <p className="section-subtitle">
            Add a clear title, what learners will get, and the credit cost.
          </p>

          <form className="stack-form" onSubmit={handleCreateSkill} style={{ marginTop: '20px' }}>
            {error && <p className="status-message status-message--error">{error}</p>}
            {successMessage && <p className="status-message status-message--success">{successMessage}</p>}
        <input
          className="input-field"
          type="text"
          placeholder="Skill Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="textarea-field"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="input-field"
          type="number"
          placeholder="Credits Cost"
          value={creditsCost}
          onChange={(e) => setCreditsCost(e.target.value)}
        />
        <select
          className="select-field"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="technology">Technology</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
          <option value="language">Language</option>
          <option value="music">Music</option>
          <option value="other">Other</option>
        </select>
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Post Skill'}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}

export default Skills;
