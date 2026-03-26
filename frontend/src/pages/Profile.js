import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getUserByFirebaseUID, updateUserProfile } from '../services/api';

function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [skillsOffered, setSkillsOffered] = useState('');
  const [skillsWanted, setSkillsWanted] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    loadProfile();
  }, [currentUser, navigate]);

  const loadProfile = async () => {
    try {
      const res = await getUserByFirebaseUID(currentUser.uid);
      const userProfile = res.data;
      setProfile(userProfile);
      setName(userProfile.name || '');
      setRole(userProfile.role || 'student');
      setSkillsOffered((userProfile.skillsOffered || []).join(', '));
      setSkillsWanted((userProfile.skillsWanted || []).join(', '));
    } catch (err) {
      setError('Unable to load your profile right now.');
    }
  };

  const toList = (value) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!profile?._id) {
      setError('Your profile is still loading. Please try again.');
      return;
    }

    if (!name.trim()) {
      setError('Name is required.');
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        name: name.trim(),
        role,
        skillsOffered: toList(skillsOffered),
        skillsWanted: toList(skillsWanted)
      };
      const res = await updateUserProfile(profile._id, payload);
      setProfile(res.data);
      setSkillsOffered((res.data.skillsOffered || []).join(', '));
      setSkillsWanted((res.data.skillsWanted || []).join(', '));
      setSuccessMessage('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile && !error) {
    return <div style={{ padding: '20px' }}><p>Loading profile...</p></div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h1>My Profile</h1>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/dashboard" style={{ marginRight: '15px' }}>Back to Dashboard</Link>
        <Link to="/skills">Skills</Link>
      </nav>

      {profile && (
        <div style={{ marginBottom: '20px' }}>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Credits:</strong> {profile.credits}</p>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        >
          <option value="student">Student</option>
          <option value="mentor">Mentor</option>
        </select>

        <textarea
          placeholder="Skills I Offer (comma separated)"
          value={skillsOffered}
          onChange={(e) => setSkillsOffered(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px', minHeight: '100px' }}
        />

        <textarea
          placeholder="Skills I Want (comma separated)"
          value={skillsWanted}
          onChange={(e) => setSkillsWanted(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px', minHeight: '100px' }}
        />

        <button type="submit" style={{ padding: '10px 20px' }} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}

export default Profile;
