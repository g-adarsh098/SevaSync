import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEMO_TASKS } from '../utils/demoData';
import { SKILL_LABELS } from '../ai/matchingEngine';

const CATEGORIES = ['all', 'education', 'healthcare', 'environment', 'technology', 'marketing'];

export default function TasksPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return DEMO_TASKS.filter(t => {
      const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'all' || t.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  return (
    <div className="page animate-fade">
      <div className="page-header">
        <h1 style={{ fontSize: '1.5rem' }}>📋 Opportunities</h1>
        <span className="badge badge-primary">{filtered.length} open</span>
      </div>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} id="task-search" />
      </div>

      <div className="filter-chips">
        {CATEGORIES.map(c => (
          <button key={c} className={`chip ${category === c ? 'active' : ''}`}
            onClick={() => setCategory(c)} id={`filter-${c}`}>
            {c === 'all' ? '🌐 All' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-md">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">No tasks found</div>
            <div className="empty-text">Try adjusting your search or filters</div>
          </div>
        ) : filtered.map((task, i) => (
          <div key={task.id} className="task-card animate-fade" onClick={() => navigate(`/tasks/${task.id}`)}
            style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="task-header">
              <div>
                <div className="task-title">{task.title}</div>
                <div className="task-ngo">{task.ngoName}</div>
              </div>
              <span className="flex items-center gap-sm">
                <span className={`urgency-dot urgency-${task.urgency}`} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{task.urgency}</span>
              </span>
            </div>
            <div className="task-desc">{task.description.slice(0, 100)}...</div>
            <div className="task-skills">
              {(task.requiredSkills || []).map(s => (
                <span key={s} className="badge badge-primary">{SKILL_LABELS[s] || s}</span>
              ))}
            </div>
            <div className="task-meta">
              <span className="task-meta-item">📅 {task.date}</span>
              <span className="task-meta-item">⏱️ {task.duration}</span>
              <span className="task-meta-item">📍 {task.location?.city}</span>
              <span className="task-meta-item">👥 {task.spots - (task.applicants?.length || 0)} spots left</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
