import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDemoMode } from '../App';
import { DEMO_TASKS, DEMO_VOLUNTEERS } from '../utils/demoData';

export default function DashboardPage() {
  const { userProfile } = useAuth();
  const { demoMode, demoUser } = useDemoMode();
  const currentUser = demoMode ? demoUser : userProfile;

  const stats = useMemo(() => {
    const appliedTasks = DEMO_TASKS.filter(t => t.applicants?.includes(currentUser?.uid));
    return {
      totalTasks: appliedTasks.length,
      hoursThisMonth: Math.round((currentUser?.hoursContributed || 0) * 0.3),
      impactScore: currentUser?.points || 0,
      badges: currentUser?.badges?.length || 0,
      completionRate: 85,
      streakDays: 12
    };
  }, [currentUser]);

  const monthlyData = [
    { month: 'Jan', hours: 18 }, { month: 'Feb', hours: 24 },
    { month: 'Mar', hours: 30 }, { month: 'Apr', hours: 22 },
    { month: 'May', hours: 0 }
  ];
  const maxHours = Math.max(...monthlyData.map(d => d.hours), 1);

  const badgeEmojis = {
    first_task: '🌟', streak_7: '🔥', streak_14: '💪', streak_30: '🏆',
    top_volunteer: '👑', healer: '❤️', creative: '🎨', educator: '📚', builder: '🔨'
  };
  const badgeNames = {
    first_task: 'First Task', streak_7: '7-Day Streak', streak_14: '14-Day Streak',
    streak_30: '30-Day Streak', top_volunteer: 'Top Volunteer', healer: 'Healer',
    creative: 'Creative', educator: 'Educator', builder: 'Builder'
  };

  return (
    <div className="page animate-fade">
      <div className="page-header">
        <h1 style={{ fontSize: '1.5rem' }}>📊 Dashboard</h1>
      </div>

      <div className="stats-grid" style={{ marginBottom: 28 }}>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-value gradient-text">{stats.totalTasks}</div>
          <div className="stat-label">Tasks Applied</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value gradient-text">{stats.hoursThisMonth}h</div>
          <div className="stat-label">This Month</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-value gradient-text">{stats.streakDays}</div>
          <div className="stat-label">Day Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-value gradient-text">{stats.completionRate}%</div>
          <div className="stat-label">Completion</div>
        </div>
      </div>

      {/* Monthly Hours Chart */}
      <div className="section">
        <h3 className="section-title" style={{ marginBottom: 16 }}>📈 Monthly Activity</h3>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 160, gap: 8 }}>
            {monthlyData.map((d, i) => (
              <div key={d.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{d.hours}h</span>
                <div style={{
                  width: '100%', maxWidth: 40,
                  height: `${(d.hours / maxHours) * 120}px`,
                  background: i === monthlyData.length - 1
                    ? 'linear-gradient(to top, var(--bg-elevated), var(--bg-input))'
                    : 'linear-gradient(to top, var(--primary), var(--accent))',
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.8s var(--ease)',
                  transitionDelay: `${i * 0.1}s`,
                  minHeight: 4
                }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{d.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="section">
        <h3 className="section-title" style={{ marginBottom: 16 }}>🏅 Your Badges</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {(currentUser?.badges || []).map(badge => (
            <div key={badge} className="card" style={{ textAlign: 'center', padding: 16 }}>
              <div style={{ fontSize: '2rem', marginBottom: 6 }}>{badgeEmojis[badge] || '🎖️'}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{badgeNames[badge] || badge}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Summary */}
      <div className="section">
        <h3 className="section-title" style={{ marginBottom: 16 }}>🌍 Impact Summary</h3>
        <div className="card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div className="flex justify-between items-center" style={{ marginBottom: 6 }}>
                <span style={{ fontSize: '0.85rem' }}>Overall Impact</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)' }}>
                  {currentUser?.points || 0} pts
                </span>
              </div>
              <div className="progress">
                <div className="progress-bar" style={{ width: `${Math.min((currentUser?.points || 0) / 20, 100)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center" style={{ marginBottom: 6 }}>
                <span style={{ fontSize: '0.85rem' }}>Profile Completion</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>75%</span>
              </div>
              <div className="progress">
                <div className="progress-bar" style={{ width: '75%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center" style={{ marginBottom: 6 }}>
                <span style={{ fontSize: '0.85rem' }}>Hours Goal (200h)</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--warning)' }}>
                  {Math.round(((currentUser?.hoursContributed || 0) / 200) * 100)}%
                </span>
              </div>
              <div className="progress">
                <div className="progress-bar" style={{ width: `${Math.min(((currentUser?.hoursContributed || 0) / 200) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
