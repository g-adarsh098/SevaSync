import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDemoMode } from '../App';
import { useAuth } from '../context/AuthContext';
import { DEMO_TASKS, DEMO_VOLUNTEERS } from '../utils/demoData';
import { computeMatchScore, SKILL_LABELS } from '../ai/matchingEngine';

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { demoMode, demoUser } = useDemoMode();
  const currentUser = demoMode ? demoUser : userProfile;

  const task = DEMO_TASKS.find(t => t.id === id);
  const [applied, setApplied] = useState(task?.applicants?.includes(currentUser?.uid) || false);

  const matchResult = useMemo(() => {
    if (!currentUser || !task) return { score: 0, breakdown: { skills: 0, location: 0, availability: 0, interest: 0 } };
    return computeMatchScore(currentUser, task);
  }, [currentUser, task]);

  const getMatchClass = (s) => s >= 70 ? 'high' : s >= 40 ? 'medium' : 'low';

  if (!task) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-icon">❌</div>
          <div className="empty-title">Task not found</div>
          <button className="btn btn-primary" onClick={() => navigate('/tasks')}>Back to Tasks</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page animate-fade" style={{ paddingBottom: 120 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Task Details</span>
      </div>

      <div className="task-detail-header">
        <div className="flex items-center gap-sm" style={{ marginBottom: 12 }}>
          <span className={`urgency-dot urgency-${task.urgency}`} />
          <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{task.urgency} Priority</span>
          <span className="badge badge-success">{task.status}</span>
        </div>
        <h1 className="task-detail-title">{task.title}</h1>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{task.ngoName}</div>
      </div>

      {/* AI Match Score */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 14 }}>
          <h3 style={{ fontSize: '1rem' }}>🤖 Your Match Score</h3>
          <div className={`match-score ${getMatchClass(matchResult.score)}`} style={{ fontSize: '1.3rem' }}>
            {matchResult.score}%
          </div>
        </div>
        <div className="match-breakdown">
          {Object.entries(matchResult.breakdown).map(([key, val]) => (
            <div key={key} className="breakdown-item">
              <div className="breakdown-label">{key}</div>
              <div className="flex items-center gap-sm">
                <div className="breakdown-bar" style={{ flex: 1 }}>
                  <div className="breakdown-fill" style={{ width: `${val}%` }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, minWidth: 30 }}>{val}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="section">
        <h3 className="section-title" style={{ marginBottom: 10 }}>Description</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{task.description}</p>
      </div>

      {/* Details */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>DATE</div><div style={{ fontWeight: 600 }}>📅 {task.date}</div></div>
          <div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>DURATION</div><div style={{ fontWeight: 600 }}>⏱️ {task.duration}</div></div>
          <div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>LOCATION</div><div style={{ fontWeight: 600 }}>📍 {task.location?.city}</div></div>
          <div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>SPOTS LEFT</div><div style={{ fontWeight: 600 }}>👥 {task.spots - (task.applicants?.length || 0)}</div></div>
        </div>
      </div>

      {/* Skills */}
      <div className="section">
        <h3 className="section-title" style={{ marginBottom: 10 }}>Required Skills</h3>
        <div className="skills-list">
          {(task.requiredSkills || []).map(s => (
            <span key={s} className={`badge ${currentUser?.skills?.includes(s) ? 'badge-success' : 'badge-primary'}`}>
              {currentUser?.skills?.includes(s) ? '✓ ' : ''}{SKILL_LABELS[s] || s}
            </span>
          ))}
        </div>
      </div>

      {/* Action */}
      <div style={{ position: 'fixed', bottom: 80, left: 0, right: 0, padding: '16px 20px', background: 'linear-gradient(transparent, var(--bg) 30%)', display: 'flex', gap: 12, maxWidth: 600, margin: '0 auto' }}>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/chat')}>
          💬 Message NGO
        </button>
        <button
          className={`btn ${applied ? 'btn-secondary' : 'btn-primary'}`}
          style={{ flex: 2 }}
          onClick={() => setApplied(!applied)}
          id="apply-btn"
        >
          {applied ? '✓ Applied — Withdraw?' : '🚀 Apply Now'}
        </button>
      </div>
    </div>
  );
}
