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
    <div style={{ padding: '20px' }}>
      <h1>Skills</h1>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/dashboard" style={{ marginRight: '15px' }}>Back to Dashboard</Link>
        <Link to="/profile">My Profile</Link>
      </nav>
      <h2>Post a New Skill</h2>
      <form onSubmit={handleCreateSkill}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        <input
          type="text"
          placeholder="Skill Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="number"
          placeholder="Credits Cost"
          value={creditsCost}
          onChange={(e) => setCreditsCost(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        >
          <option value="technology">Technology</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
          <option value="language">Language</option>
          <option value="music">Music</option>
          <option value="other">Other</option>
        </select>
        <button type="submit" style={{ padding: '10px 20px' }} disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Post Skill'}
        </button>
      </form>
      <h2>All Skills</h2>
      {skills.map(skill => (
        <div key={skill._id} style={{
          border: '1px solid #ccc',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '5px'
        }}>
          <h3>{skill.title}</h3>
          <p>{skill.description}</p>
          <p>Cost: {skill.creditsCost} credits</p>
        </div>
      ))}
    </div>
  );
}

export default Skills;
