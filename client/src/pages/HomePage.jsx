import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SERVICE_CATEGORIES, getCategoryStats } from '../utils/rotaractData';

export default function HomePage() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  const displayName = userProfile?.displayName || user?.displayName || 'Volunteer';
  const firstName = displayName.split(' ')[0];

  // User's real stats — 0 for new users
  const bloodDonations = userProfile?.bloodDonations || 0;
  const hoursContributed = userProfile?.hoursContributed || 0;
  const eventsVolunteered = userProfile?.eventsVolunteered || 0;
  const points = userProfile?.points || 0;
  const treesPlanted = userProfile?.treesPlanted || 0;
  const mealsServed = userProfile?.mealsServed || 0;
  const organPledges = userProfile?.organPledges || 0;
  const beneficiariesHelped = userProfile?.beneficiariesHelped || 0;
  const volunteerHistory = userProfile?.volunteerHistory || [];

  // Category stats (static — from rotaract community data, not user-specific)
  const catStats = useMemo(() => getCategoryStats(), []);

  // Recent history (user's own)
  const recentHistory = [...volunteerHistory].reverse().slice(0, 5);

  return (
    <div className="page animate-fade">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-name">Hey, {firstName}! 👋</div>
        <div className="welcome-sub">
          {eventsVolunteered === 0
            ? 'Start your volunteering journey today!'
            : `You've made a real difference with ${eventsVolunteered} event${eventsVolunteered > 1 ? 's' : ''}!`}
        </div>
        <button className="urgent-chip" onClick={() => navigate('/nearby')} id="urgent-needs-btn">
          📍 Find urgent needs near you
        </button>
      </div>

      {/* Recently Accepted Notification */}
      {userProfile?.lastVolunteered && (
        <div className="animate-fade" style={{ marginBottom: 24 }}>
          <div className="card-glass" style={{ borderLeft: '4px solid var(--accent)', padding: '12px 16px' }}>
            <div className="flex items-center gap-md">
              <div style={{ fontSize: '1.5rem' }}>🙌</div>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase' }}>
                  Current Task
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  {userProfile.lastVolunteered.title}
                </div>
              </div>
              <button className="btn btn-sm btn-ghost" style={{ marginLeft: 'auto', padding: '4px 8px' }}
                onClick={() => navigate('/profile')}>
                View Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary Stats — User's own data */}

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card" onClick={() => navigate('/analytics')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon">🩸</div>
          <div className="stat-value gradient-text">{bloodDonations}</div>
          <div className="stat-label">Blood Donations</div>
        </div>
        <div className="stat-card" onClick={() => navigate('/nearby')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon">📋</div>
          <div className="stat-value gradient-text">{eventsVolunteered}</div>
          <div className="stat-label">Events Joined</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value gradient-text">{hoursContributed}</div>
          <div className="stat-label">Hours Given</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-value gradient-text">{points}</div>
          <div className="stat-label">Points</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section">
        <h2 className="section-title" style={{ marginBottom: 14 }}>⚡ Quick Actions</h2>
        <div className="quick-actions-grid">
          <button className="quick-action-btn" onClick={() => navigate('/nearby')} id="qa-nearby">
            <span className="qa-icon" style={{ background: 'rgba(239,68,68,0.15)' }}>🩸</span>
            <span className="qa-label">Blood Needs</span>
          </button>
          <button className="quick-action-btn" onClick={() => navigate('/nearby')} id="qa-health">
            <span className="qa-icon" style={{ background: 'rgba(59,130,246,0.15)' }}>🏥</span>
            <span className="qa-label">Health Camps</span>
          </button>
          <button className="quick-action-btn" onClick={() => navigate('/nearby')} id="qa-organ">
            <span className="qa-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>💚</span>
            <span className="qa-label">Organ Pledge</span>
          </button>
          <button className="quick-action-btn" onClick={() => navigate('/analytics')} id="qa-analytics">
            <span className="qa-icon" style={{ background: 'rgba(108,99,255,0.15)' }}>📊</span>
            <span className="qa-label">Analytics</span>
          </button>
        </div>
      </div>

      {/* Your Impact Summary */}
      <div className="section">
        <h2 className="section-title" style={{ marginBottom: 14 }}>🌟 Your Impact</h2>
        <div className="achievements-row">
          <div className="achievement-card" style={{ borderLeftColor: '#EF4444' }}>
            <div style={{ fontSize: '1.6rem' }}>🩸</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{bloodDonations}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Blood Donations</div>
          </div>
          <div className="achievement-card" style={{ borderLeftColor: '#22C55E' }}>
            <div style={{ fontSize: '1.6rem' }}>🌳</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{treesPlanted}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Trees Planted</div>
          </div>
          <div className="achievement-card" style={{ borderLeftColor: '#F59E0B' }}>
            <div style={{ fontSize: '1.6rem' }}>🍱</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{mealsServed}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Meals Served</div>
          </div>
          <div className="achievement-card" style={{ borderLeftColor: '#10B981' }}>
            <div style={{ fontSize: '1.6rem' }}>💚</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{organPledges}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Organ Pledges</div>
          </div>
        </div>
      </div>

      {/* Service Categories Overview */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">🎯 Service Areas</h2>
          <button className="section-link" onClick={() => navigate('/analytics')}>View All</button>
        </div>
        <div className="service-cat-scroll">
          {SERVICE_CATEGORIES.slice(0, 6).map((cat) => {
            const stats = catStats[cat.id];
            return (
              <div key={cat.id} className="service-cat-card" onClick={() => navigate('/nearby')}>
                <div style={{ fontSize: '2rem', marginBottom: 6 }}>{cat.icon}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{cat.label}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {stats?.activeNeeds || 0} active
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Volunteer Activity */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">📋 Your Activity</h2>
          {volunteerHistory.length > 0 && (
            <button className="section-link" onClick={() => navigate('/analytics')}>View All</button>
          )}
        </div>
        {recentHistory.length > 0 ? (
          <div className="flex flex-col gap-sm">
            {recentHistory.map((entry, i) => {
              const cat = SERVICE_CATEGORIES.find(c => c.id === entry.category);
              return (
                <div key={`${entry.needId}-${i}`} className="project-card animate-fade" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-sm">
                      <span style={{ fontSize: '1.3rem' }}>{cat?.icon || '📌'}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{entry.title}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          📅 {new Date(entry.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <span className="badge badge-success">✓ Done</span>
                  </div>
                  {entry.hours > 0 && (
                    <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      ⏱️ {entry.hours}h contributed
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🚀</div>
            <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 6 }}>No activity yet</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Head to Nearby to find your first volunteer opportunity!
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/nearby')} id="start-volunteering-btn">
              📍 Find Opportunities
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
