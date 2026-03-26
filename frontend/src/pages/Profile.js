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
    return (
      <div className="page-shell">
        <div className="content-shell">
          <div className="panel-card">
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="content-shell grid-layout grid-layout--sidebar">
        <section className="panel-card">
          <span className="pill">Profile Settings</span>
          <h1 className="page-title" style={{ marginTop: '16px' }}>Shape how others learn from you.</h1>
          <p className="page-subtitle">
            Keep your identity, role, and learning interests current so matches feel more relevant.
          </p>

          <div className="nav-row">
            <Link className="nav-link" to="/dashboard">Back to Dashboard</Link>
            <Link className="nav-link" to="/skills">Skills</Link>
          </div>

          {profile && (
            <div className="profile-summary" style={{ marginTop: '28px' }}>
              <div className="summary-item">
                <span className="summary-label">Email</span>
                <strong>{profile.email}</strong>
              </div>
              <div className="summary-item">
                <span className="summary-label">Credits</span>
                <strong>{profile.credits}</strong>
              </div>
            </div>
          )}
        </section>

        <aside className="form-card">
          <h2 className="section-heading">Update my profile</h2>
          <p className="section-subtitle">
            Use comma-separated lists for skills so you can quickly keep this up to date.
          </p>

          <form className="stack-form" onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            {error && <p className="status-message status-message--error">{error}</p>}
            {successMessage && <p className="status-message status-message--success">{successMessage}</p>}
        <input
          className="input-field"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="select-field"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="mentor">Mentor</option>
        </select>

        <textarea
          className="textarea-field"
          placeholder="Skills I Offer (comma separated)"
          value={skillsOffered}
          onChange={(e) => setSkillsOffered(e.target.value)}
        />

        <textarea
          className="textarea-field"
          placeholder="Skills I Want (comma separated)"
          value={skillsWanted}
          onChange={(e) => setSkillsWanted(e.target.value)}
        />

            <button className="primary-button" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}

export default Profile;
