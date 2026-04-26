import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemoMode } from '../App';
import { useAuth } from '../context/AuthContext';
import { DEMO_TASKS } from '../utils/demoData';
import { rankTasksForVolunteer, SKILL_LABELS } from '../ai/matchingEngine';

export default function MatchingPage() {
  const { userProfile } = useAuth();
  const { demoMode, demoUser } = useDemoMode();
  const currentUser = demoMode ? demoUser : userProfile;
  const navigate = useNavigate();

  const rankedTasks = useMemo(() => {
    if (!currentUser) return [];
    return rankTasksForVolunteer(currentUser, DEMO_TASKS);
  }, [currentUser]);

  const getMatchClass = (s) => s >= 70 ? 'high' : s >= 40 ? 'medium' : 'low';

  return (
    <div className="page animate-fade">
      <div className="page-header">
        <h1 style={{ fontSize: '1.5rem' }}>🤖 AI Matching</h1>
      </div>

      <div className="card-glass" style={{ marginBottom: 24, padding: 20 }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Our AI analyzes your <strong style={{ color: 'var(--primary)' }}>skills</strong>,{' '}
          <strong style={{ color: 'var(--accent)' }}>location</strong>,{' '}
          <strong style={{ color: 'var(--warning)' }}>availability</strong>, and{' '}
          <strong style={{ color: 'var(--info)' }}>interests</strong> to find your perfect matches.
        </p>
      </div>

      <div className="flex flex-col gap-md">
        {rankedTasks.map((task, i) => (
          <div key={task.id} className="match-card animate-fade" style={{ animationDelay: `${i * 0.08}s`, cursor: 'pointer' }}
            onClick={() => navigate(`/tasks/${task.id}`)}>
            <div className="flex justify-between items-center" style={{ marginBottom: 12 }}>
              <div>
                <div className="task-title">{task.title}</div>
                <div className="task-ngo">{task.ngoName}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className={`match-score ${getMatchClass(task.match.score)}`} style={{ fontSize: '1.5rem', justifyContent: 'flex-end' }}>
                  {task.match.score}%
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Match Score</div>
              </div>
            </div>

            {/* Full match bar */}
            <div style={{ marginBottom: 14 }}>
              <div className="progress" style={{ height: 8 }}>
                <div className="progress-bar" style={{ width: `${task.match.score}%` }} />
              </div>
            </div>

            {/* Breakdown */}
            <div className="match-breakdown">
              {Object.entries(task.match.breakdown).map(([key, val]) => (
                <div key={key} className="breakdown-item">
                  <div className="breakdown-label">
                    {key === 'skills' ? '🧠' : key === 'location' ? '📍' : key === 'availability' ? '📅' : '❤️'} {key}
                  </div>
                  <div className="flex items-center gap-sm">
                    <div className="breakdown-bar" style={{ flex: 1 }}>
                      <div className="breakdown-fill" style={{ width: `${val}%` }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, minWidth: 30 }}>{val}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="task-skills" style={{ marginTop: 12 }}>
              {(task.requiredSkills || []).map(s => (
                <span key={s} className={`badge ${currentUser?.skills?.includes(s) ? 'badge-success' : 'badge-primary'}`}>
                  {SKILL_LABELS[s] || s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
