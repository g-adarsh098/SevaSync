import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SKILL_LABELS, MASTER_SKILLS } from '../ai/matchingEngine';

export default function ProfilePage() {
  const { user, userProfile, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [editSkills, setEditSkills] = useState(userProfile?.skills || []);
  const [saving, setSaving] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleSkill = (skill) => {
    setEditSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const saveSkills = async () => {
    setSaving(true);
    try {
      await updateUserProfile({ skills: editSkills });
    } catch (e) {
      console.error('Failed to save skills:', e);
    }
    setSaving(false);
    setEditing(false);
  };

  const badgeEmojis = {
    first_task: '🌟', streak_7: '🔥', streak_14: '💪', streak_30: '🏆',
    top_volunteer: '👑', healer: '❤️', creative: '🎨', educator: '📚', builder: '🔨'
  };

  return (
    <div className="page animate-fade">
      {/* Recently Accepted Notification */}
      {userProfile?.lastVolunteered && (
        <div className="section animate-fade" style={{ marginBottom: 0 }}>
          <div className="card-glass" style={{ borderLeft: '4px solid var(--accent)', padding: '16px 20px' }}>
            <div className="flex items-center gap-md">
              <div style={{ fontSize: '1.8rem' }}>🙌</div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Recently Accepted
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
                  {userProfile.lastVolunteered.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                  Thank you for volunteering! Your impact is being tracked.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Header */}

      <div className="profile-header">
        <div className="avatar avatar-xl">
          {userProfile?.photoURL
            ? <img src={userProfile.photoURL} alt="avatar" />
            : (userProfile?.displayName || user?.displayName || 'U')[0]
          }
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: 4 }}>{userProfile?.displayName || user?.displayName || 'User'}</h2>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user?.email}</div>
          <span className="badge badge-primary" style={{ marginTop: 8, display: 'inline-flex', textTransform: 'capitalize' }}>
            {userProfile?.role || 'volunteer'}
          </span>
        </div>
        <div className="profile-stats">
          <div>
            <div className="profile-stat-value gradient-text">{userProfile?.hoursContributed || 0}</div>
            <div className="profile-stat-label">Hours</div>
          </div>
          <div>
            <div className="profile-stat-value gradient-text">{userProfile?.points || 0}</div>
            <div className="profile-stat-label">Points</div>
          </div>
          <div>
            <div className="profile-stat-value gradient-text">{userProfile?.eventsVolunteered || 0}</div>
            <div className="profile-stat-label">Events</div>
          </div>
        </div>
      </div>

      {/* Badges */}
      {(userProfile?.badges?.length > 0) && (
        <div className="section">
          <h3 className="section-title" style={{ marginBottom: 12 }}>🏅 Badges</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {userProfile.badges.map(b => (
              <div key={b} className="badge badge-primary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                {badgeEmojis[b] || '🎖️'} {b.replace(/_/g, ' ')}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      <div className="section">
        <div className="section-header">
          <h3 className="section-title">🧠 Skills</h3>
          <button className="section-link" onClick={() => {
            if (editing) saveSkills();
            else setEditing(true);
          }}>
            {saving ? 'Saving...' : editing ? 'Save' : 'Edit'}
          </button>
        </div>
        {editing ? (
          <div className="skills-list">
            {MASTER_SKILLS.map(s => (
              <button key={s} className={`chip ${editSkills.includes(s) ? 'active' : ''}`}
                onClick={() => toggleSkill(s)}>
                {SKILL_LABELS[s] || s}
              </button>
            ))}
          </div>
        ) : (
          <div className="skills-list">
            {(userProfile?.skills || []).map(s => (
              <span key={s} className="badge badge-primary">{SKILL_LABELS[s] || s}</span>
            ))}
            {(!userProfile?.skills || userProfile.skills.length === 0) && (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No skills added yet</span>
            )}
          </div>
        )}
      </div>

      {/* Location */}
      <div className="section">
        <h3 className="section-title" style={{ marginBottom: 12 }}>📍 Location</h3>
        <div className="card">
          <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            {userProfile?.location?.city || 'Not set'}
          </div>
          {userProfile?.location && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Lat: {userProfile.location.lat}, Lng: {userProfile.location.lng}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section">
        <h3 className="section-title" style={{ marginBottom: 12 }}>⚡ Quick Actions</h3>
        <div className="flex flex-col gap-sm">
          <button className="btn btn-secondary w-full" onClick={() => navigate('/analytics')}>
            📊 View Analytics
          </button>
          <button className="btn btn-secondary w-full" onClick={() => navigate('/nearby')}>
            📍 Find Nearby Needs
          </button>
          <button className="btn btn-secondary w-full" style={{ color: 'var(--danger)' }} onClick={handleLogout} id="logout-btn">
            🚪 Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
