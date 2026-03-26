import React, { useState, useEffect } from 'react';
import { getSkills, createSkill } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Skills() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creditsCost, setCreditsCost] = useState('');
  const [category, setCategory] = useState('technology');

  useEffect(() => {
    if (!currentUser) navigate('/');
    getSkills().then(res => setSkills(res.data));
  }, [currentUser, navigate]);

  const handleCreateSkill = async (e) => {
    e.preventDefault();
    try {
      await createSkill({
        title,
        description,
        creditsCost: Number(creditsCost),
        teacher: currentUser.uid,
        category
      });
      getSkills().then(res => setSkills(res.data));
      setTitle('');
      setDescription('');
      setCreditsCost('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Skills</h1>
      <h2>Post a New Skill</h2>
      <form onSubmit={handleCreateSkill}>
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
        <button type="submit" style={{ padding: '10px 20px' }}>Post Skill</button>
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