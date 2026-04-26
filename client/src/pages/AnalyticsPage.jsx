import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  SERVICE_CATEGORIES, SERVICE_PROJECTS,
  CLUB_STATS, getCategoryStats
} from '../utils/rotaractData';

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  // User's real stats — 0 for new users
  const hoursContributed = userProfile?.hoursContributed || 0;
  const eventsVolunteered = userProfile?.eventsVolunteered || 0;
  const points = userProfile?.points || 0;
  const bloodDonations = userProfile?.bloodDonations || 0;
  const treesPlanted = userProfile?.treesPlanted || 0;
  const mealsServed = userProfile?.mealsServed || 0;
  const organPledges = userProfile?.organPledges || 0;
  const beneficiariesHelped = userProfile?.beneficiariesHelped || 0;
  const volunteerHistory = userProfile?.volunteerHistory || [];

  // Community stats (static)
  const catStats = useMemo(() => getCategoryStats(), []);
  const maxCatHours = useMemo(() => Math.max(...Object.values(catStats).map(c => c.totalHours), 1), [catStats]);
  const sortedCats = useMemo(() =>
    Object.values(catStats).sort((a, b) => b.totalHours - a.totalHours),
  [catStats]);

  // Group user's history by category
  const userCategoryBreakdown = useMemo(() => {
    const breakdown = {};
    volunteerHistory.forEach(entry => {
      if (!breakdown[entry.category]) {
        breakdown[entry.category] = { count: 0, hours: 0 };
      }
      breakdown[entry.category].count += 1;
      breakdown[entry.category].hours += entry.hours || 0;
    });
    return breakdown;
  }, [volunteerHistory]);

  // User's max hours for scaling bars
  const userMaxHours = useMemo(() =>
    Math.max(...Object.values(userCategoryBreakdown).map(c => c.hours), 1),
  [userCategoryBreakdown]);

  return (
    <div className="page animate-fade">
      <div className="page-header">
        <div className="flex items-center gap-sm">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <h1 style={{ fontSize: '1.5rem' }}>📊 Analytics</h1>
        </div>
      </div>

      {/* ====== YOUR STATS ====== */}
      <div className="section">
        <h3 className="section-title" style={{ marginBottom: 14 }}>🙋 Your Stats</h3>
        <div className="stats-grid">
          <div className="stat-card">
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
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-value gradient-text">{beneficiariesHelped}</div>
            <div className="stat-label">People Helped</div>
          </div>
        </div>
      </div>

      {/* Your Achievements */}
      <div className="section">
        <h3 className="section-title" style={{ marginBottom: 14 }}>🏅 Your Achievements</h3>
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

      {/* Your Category Breakdown */}
      {Object.keys(userCategoryBreakdown).length > 0 && (
        <div className="section">
          <h3 className="section-title" style={{ marginBottom: 14 }}>📈 Your Activity Breakdown</h3>
          <div className="flex flex-col gap-sm">
            {Object.entries(userCategoryBreakdown)
              .sort(([,a], [,b]) => b.hours - a.hours)
              .map(([catId, data], i) => {
                const cat = SERVICE_CATEGORIES.find(c => c.id === catId);
                if (!cat) return null;
                return (
                  <div key={catId} className="cat-stat-card animate-fade" style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className="flex items-center gap-sm" style={{ marginBottom: 10 }}>
                      <span style={{ fontSize: '1.3rem' }}>{cat.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cat.label}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {data.count} event{data.count > 1 ? 's' : ''}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: cat.color }}>{data.hours}h</div>
                      </div>
                    </div>
                    <div className="progress" style={{ height: 5 }}>
                      <div style={{
                        height: '100%', borderRadius: 3, background: cat.color,
                        width: `${(data.hours / userMaxHours) * 100}%`,
                        transition: 'width 0.8s var(--ease)', transitionDelay: `${i * 0.1}s`,
                      }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Divider */}
      <div style={{
        margin: '32px 0 24px', padding: '12px 0',
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '1px',
      }}>
        🏛️ Community Overview
      </div>

      {/* Club Summary */}
      <div className="section">
        <h3 className="section-title" style={{ marginBottom: 14 }}>🏛️ Club Overview</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-value gradient-text">{CLUB_STATS.totalProjects}</div>
            <div className="stat-label">Total Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value gradient-text">{CLUB_STATS.activeVolunteers}</div>
            <div className="stat-label">Active Members</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-value gradient-text">{CLUB_STATS.totalHoursLogged}</div>
            <div className="stat-label">Total Hours</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-value gradient-text">{CLUB_STATS.totalBeneficiaries.toLocaleString()}</div>
            <div className="stat-label">Beneficiaries</div>
          </div>
        </div>
      </div>

      {/* Community Achievements */}
      <div className="section">
        <h3 className="section-title" style={{ marginBottom: 14 }}>🏅 Community Achievements</h3>
        <div className="achievements-row">
          <div className="achievement-card" style={{ borderLeftColor: '#EF4444' }}>
            <div style={{ fontSize: '1.6rem' }}>🩸</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{CLUB_STATS.bloodUnitsCollected}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Blood Units</div>
          </div>
          <div className="achievement-card" style={{ borderLeftColor: '#22C55E' }}>
            <div style={{ fontSize: '1.6rem' }}>🌳</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{CLUB_STATS.treesPlanted}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Trees Planted</div>
          </div>
          <div className="achievement-card" style={{ borderLeftColor: '#F59E0B' }}>
            <div style={{ fontSize: '1.6rem' }}>🍱</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{CLUB_STATS.mealsServed}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Meals Served</div>
          </div>
          <div className="achievement-card" style={{ borderLeftColor: '#10B981' }}>
            <div style={{ fontSize: '1.6rem' }}>💚</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{CLUB_STATS.organPledges}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Organ Pledges</div>
          </div>
        </div>
      </div>

      {/* Category Breakdown — Community */}
      <div className="section">
        <h3 className="section-title" style={{ marginBottom: 14 }}>🎯 Service Categories</h3>
        <div className="flex flex-col gap-sm">
          {sortedCats.filter(c => c.projectCount > 0).map((cat, i) => (
            <div key={cat.id} className="cat-stat-card animate-fade" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="flex items-center gap-sm" style={{ marginBottom: 10 }}>
                <span style={{ fontSize: '1.3rem' }}>{cat.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cat.label}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {cat.projectCount} project{cat.projectCount > 1 ? 's' : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: cat.color }}>{cat.totalHours}h</div>
                </div>
              </div>
              <div className="progress" style={{ height: 5 }}>
                <div style={{
                  height: '100%', borderRadius: 3, background: cat.color,
                  width: `${(cat.totalHours / maxCatHours) * 100}%`,
                  transition: 'width 0.8s var(--ease)', transitionDelay: `${i * 0.1}s`,
                }} />
              </div>
              <div className="flex gap-md" style={{ marginTop: 8, fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                <span>👥 {cat.totalVolunteers} volunteers</span>
                <span>🎯 {cat.totalBeneficiaries} beneficiaries</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Satisfaction */}
      <div className="section">
        <h3 className="section-title" style={{ marginBottom: 14 }}>⭐ Community Satisfaction</h3>
        <div className="card" style={{ textAlign: 'center', padding: 28 }}>
          <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-display)' }}>
            <span className="gradient-text">{CLUB_STATS.avgSatisfaction}</span>
            <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/5</span>
          </div>
          <div style={{ fontSize: '1.5rem', marginTop: 4 }}>
            {'⭐'.repeat(Math.round(CLUB_STATS.avgSatisfaction))}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 8 }}>
            Based on {CLUB_STATS.totalProjects} projects
          </div>
        </div>
      </div>
    </div>
  );
}
