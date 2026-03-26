import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    API.get(`/users/firebase/${currentUser.uid}`)
      .then(res => setProfile(res.data))
      .catch(err => console.error(err));
  }, [currentUser, navigate]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>My Profile</h1>
      {profile ? (
        <div>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          <p>Role: {profile.role}</p>
          <p>Credits: {profile.credits}</p>
          <h3>Skills I Offer:</h3>
          <p>{profile.skillsOffered?.join(', ') || 'None yet'}</p>
          <h3>Skills I Want:</h3>
          <p>{profile.skillsWanted?.join(', ') || 'None yet'}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}

export default Profile;