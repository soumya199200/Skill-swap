import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  acceptSession,
  cancelSession,
  completeSession,
  getUserByFirebaseUID,
  getUserSessions
} from '../services/api';

function Sessions() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [currentProfile, setCurrentProfile] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeSessionId, setActiveSessionId] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    loadSessions();
  }, [currentUser, navigate]);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const profileRes = await getUserByFirebaseUID(currentUser.uid);
      setCurrentProfile(profileRes.data);
      const sessionsRes = await getUserSessions(profileRes.data._id);
      setSessions(sessionsRes.data);
    } catch (err) {
      setError('Unable to load sessions right now.');
    } finally {
      setIsLoading(false);
    }
  };

  const runSessionAction = async (action, sessionId, successText) => {
    try {
      setActiveSessionId(sessionId);
      setError('');
      setSuccessMessage('');
      await action(sessionId);
      await loadSessions();
      setSuccessMessage(successText);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update session.');
    } finally {
      setActiveSessionId('');
    }
  };

  const formatDate = (value) =>
    new Date(value).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

  const isMentorForSession = (session) => currentProfile?._id === session.mentor?._id;
  const isStudentForSession = (session) => currentProfile?._id === session.student?._id;
  const incomingRequests = sessions.filter((session) => isMentorForSession(session) && session.status === 'pending');
  const myBookedSessions = sessions.filter((session) => isStudentForSession(session));
  const myMentorSessions = sessions.filter((session) => isMentorForSession(session) && session.status !== 'pending');

  const renderSessionCard = (session) => (
    <article className="skill-card" key={session._id}>
      <h3>{session.skill?.title || 'Session'}</h3>
      <p>Status: <strong>{session.status}</strong></p>
      <p>Scheduled: {formatDate(session.scheduledAt)}</p>
      <p>Mentor: {session.mentor?.name || 'Unknown'}</p>
      <p>Student: {session.student?.name || 'Unknown'}</p>
      <p>Credits: {session.creditsUsed}</p>
      {session.notes ? <p>Notes: {session.notes}</p> : null}

      <div className="button-row">
        {isMentorForSession(session) && session.status === 'pending' && (
          <button
            className="primary-button"
            type="button"
            disabled={activeSessionId === session._id}
            onClick={() => runSessionAction(acceptSession, session._id, 'Session accepted successfully.')}
          >
            {activeSessionId === session._id ? 'Updating...' : 'Accept'}
          </button>
        )}

        {isMentorForSession(session) && session.status === 'accepted' && (
          <button
            className="primary-button"
            type="button"
            disabled={activeSessionId === session._id}
            onClick={() => runSessionAction(completeSession, session._id, 'Session marked as completed.')}
          >
            {activeSessionId === session._id ? 'Updating...' : 'Complete'}
          </button>
        )}

        {(isStudentForSession(session) || isMentorForSession(session)) &&
          session.status !== 'completed' &&
          session.status !== 'cancelled' && (
            <button
              className="secondary-button"
              type="button"
              disabled={activeSessionId === session._id}
              onClick={() => runSessionAction(cancelSession, session._id, 'Session cancelled successfully.')}
            >
              {activeSessionId === session._id ? 'Updating...' : 'Cancel'}
            </button>
          )}
      </div>
    </article>
  );

  return (
    <div className="page-shell">
      <div className="content-shell">
        <section className="hero-panel panel-card">
          <span className="pill">Session Hub</span>
          <h1 className="page-title">Track every learning request in one place.</h1>
          <p className="page-subtitle">
            Accept, complete, or cancel sessions so both mentors and students stay in sync.
          </p>
          <div className="nav-row">
            <Link className="nav-link" to="/dashboard">Back to Dashboard</Link>
            <Link className="nav-link" to="/skills">Skills</Link>
            <Link className="nav-link" to="/profile">My Profile</Link>
          </div>
        </section>

        <section className="panel-card">
          <h2 className="section-heading">Session Requests and Bookings</h2>
          {error && <p className="status-message status-message--error">{error}</p>}
          {successMessage && <p className="status-message status-message--success">{successMessage}</p>}

          {isLoading ? (
            <p>Loading sessions...</p>
          ) : sessions.length === 0 ? (
            <div className="skill-card">
              <h3>No sessions yet</h3>
              <p>Book a skill session or wait for a learner to reach out.</p>
            </div>
          ) : (
            <div className="grid-layout">
              <div>
                <h3 className="section-heading" style={{ fontSize: '1.6rem' }}>Incoming Requests</h3>
                <div className="skills-grid">
                  {incomingRequests.length === 0 ? (
                    <div className="skill-card">
                      <h3>No incoming requests</h3>
                      <p>When a student books your skill, it will appear here for acceptance.</p>
                    </div>
                  ) : incomingRequests.map(renderSessionCard)}
                </div>
              </div>

              <div>
                <h3 className="section-heading" style={{ fontSize: '1.6rem' }}>My Booked Sessions</h3>
                <div className="skills-grid">
                  {myBookedSessions.length === 0 ? (
                    <div className="skill-card">
                      <h3>No bookings yet</h3>
                      <p>Book a mentor session from the skills marketplace to see it here.</p>
                    </div>
                  ) : myBookedSessions.map(renderSessionCard)}
                </div>
              </div>

              <div>
                <h3 className="section-heading" style={{ fontSize: '1.6rem' }}>Mentor Session Updates</h3>
                <div className="skills-grid">
                  {myMentorSessions.length === 0 ? (
                    <div className="skill-card">
                      <h3>No accepted mentor sessions</h3>
                      <p>Accepted and completed sessions that you mentor will appear here.</p>
                    </div>
                  ) : myMentorSessions.map(renderSessionCard)}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Sessions;
