import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Brain, Key, CheckCircle2, RefreshCw } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../utils/rotaractData';

const QUESTIONS = [
  {
    id: 'skills',
    question: "What are your top skills?",
    subtitle: "Select up to 3 skills that describe you best",
    options: [
      "Teaching/Education", "Coding/Tech", "Graphic Design",
      "Public Speaking", "Event Management", "First Aid/Medical",
      "Social Media", "Writing/Content", "Cooking/Food"
    ],
    multiple: true
  },
  {
    id: 'cause',
    question: "Which cause are you most passionate about?",
    subtitle: "We'll prioritize projects in this area",
    options: ["Education", "Health & Wellness", "Environment", "Poverty Alleviation", "Disaster Relief"],
    multiple: false
  },
  {
    id: 'time',
    question: "How many hours can you commit per week?",
    subtitle: "Be realistic to find the best match",
    options: ["1-2 hours", "3-5 hours", "5-10 hours", "Full Weekend"],
    multiple: false
  },
  {
    id: 'style',
    question: "How do you prefer to volunteer?",
    subtitle: "Your working style matters",
    options: ["Directly with people", "Behind the scenes/Tech", "Physical work/Outdoors", "Teaching/Mentoring"],
    multiple: false
  }
];
const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

export default function AISuggestionPage() {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState(localStorage.getItem(groqApiKey) || '');
  const [showKeyInput, setShowKeyInput] = useState(!localStorage.getItem(groqApiKey));
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleKeySubmit = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem(groqApiKey, apiKey);
      setShowKeyInput(false);
    }
  };

  const handleOptionSelect = (option) => {
    const q = QUESTIONS[currentStep];
    if (q.multiple) {
      const current = answers[q.id] || [];
      if (current.includes(option)) {
        setAnswers({ ...answers, [q.id]: current.filter(o => o !== option) });
      } else if (current.length < 3) {
        setAnswers({ ...answers, [q.id]: [...current, option] });
      }
    } else {
      setAnswers({ ...answers, [q.id]: option });
      setTimeout(() => nextStep(), 300);
    }
  };

  const nextStep = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateSuggestions();
    }
  };

  const generateSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const prompt = `
        As a smart volunteer coordinator, suggest 3 specific volunteer project ideas for a user based on these answers:
        - Skills: ${Array.isArray(answers.skills) ? answers.skills.join(', ') : answers.skills}
        - Passion: ${answers.cause}
        - Commitment: ${answers.time}
        - Style: ${answers.style}

        Format your response ONLY as a JSON array of 3 objects, each with:
        - title: Name of the project
        - description: 2-sentence description of what they'll do
        - why: Why this matches their profile
        - category: One of these: ${SERVICE_CATEGORIES.map(c => c.id).join(', ')}
        - impact: High/Medium/Low
      `;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that only outputs JSON.' },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      let content = data.choices[0].message.content;

      // Groq with json_object mode might return a wrapper object like { "suggestions": [...] }
      // or just the array if specified correctly. We'll handle both.
      let parsed = JSON.parse(content);
      if (parsed.suggestions) parsed = parsed.suggestions;
      if (!Array.isArray(parsed)) {
        // Look for any array inside the object
        const values = Object.values(parsed);
        const foundArray = values.find(v => Array.isArray(v));
        if (foundArray) parsed = foundArray;
        else throw new Error('AI did not return a valid list of suggestions.');
      }

      setSuggestions(parsed.slice(0, 3));
    } catch (err) {
      console.error('Groq Error:', err);
      setError(err.message || 'Failed to generate suggestions. Please check your Groq API key.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setAnswers({});
    setSuggestions(null);
    setError(null);
  };

  if (showKeyInput) {
    return (
      <div className="page animate-fade">
        <div className="page-header">
          <h1 style={{ fontSize: '1.5rem' }}>✨ AI Suggestions</h1>
        </div>
        <div className="card" style={{ marginTop: 20 }}>
          <div className="flex flex-col items-center text-center gap-md">
            <div className="icon-circle bg-primary-light">
              <Sparkles className="text-primary" size={24} />
            </div>
            <h3>Enter Groq API Key</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              We've switched to <strong>Groq (Llama 3)</strong> for faster and more reliable suggestions. Your key is stored locally.
            </p>
            <form onSubmit={handleKeySubmit} style={{ width: '100%', marginTop: 8 }}>
              <input
                type="password"
                className="input"
                placeholder="gsk_..."
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary w-full" style={{ marginTop: 16 }}>
                Start AI Matching
              </button>
            </form>
            <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>
              Get a free API key from Groq Console
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page animate-fade" style={{ paddingBottom: 100 }}>
      <div className="page-header">
        <div className="flex justify-between items-center w-full">
          <h1 style={{ fontSize: '1.5rem' }}>✨ AI Suggestions</h1>
          <button onClick={() => setShowKeyInput(true)} className="btn btn-icon-only" title="Settings">
            <Key size={18} />
          </button>
        </div>
      </div>

      {!suggestions && !loading && (
        <div className="question-container">
          <div className="progress-mini" style={{ marginBottom: 24 }}>
            <div className="progress-bar" style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 style={{ fontSize: '1.4rem', marginBottom: 8 }}>{QUESTIONS[currentStep].question}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: '0.9rem' }}>
                {QUESTIONS[currentStep].subtitle}
              </p>

              <div className="flex flex-col gap-sm">
                {QUESTIONS[currentStep].options.map(option => {
                  const isSelected = QUESTIONS[currentStep].multiple
                    ? (answers[QUESTIONS[currentStep].id] || []).includes(option)
                    : answers[QUESTIONS[currentStep].id] === option;

                  return (
                    <button
                      key={option}
                      className={`btn w-full text-left ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => handleOptionSelect(option)}
                      style={{
                        justifyContent: 'flex-start',
                        padding: '16px 20px',
                        border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)'
                      }}
                    >
                      {option}
                      {isSelected && <CheckCircle2 size={16} style={{ marginLeft: 'auto' }} />}
                    </button>
                  );
                })}
              </div>

              {QUESTIONS[currentStep].multiple && (
                <button
                  className="btn btn-primary w-full"
                  style={{ marginTop: 24 }}
                  disabled={!(answers[QUESTIONS[currentStep].id]?.length > 0)}
                  onClick={nextStep}
                >
                  Continue <ArrowRight size={18} style={{ marginLeft: 8 }} />
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center" style={{ minHeight: '50vh' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{ marginBottom: 24 }}
          >
            <Brain size={64} className="text-primary" />
          </motion.div>
          <h3>Analyzing your profile...</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Gemini AI is finding your perfect matches</p>
        </div>
      )}

      {error && (
        <div className="card" style={{ borderColor: 'var(--danger)', marginTop: 20 }}>
          <p style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{error}</p>
          <button className="btn btn-secondary w-full" style={{ marginTop: 16 }} onClick={reset}>
            Try Again
          </button>
        </div>
      )}

      {suggestions && !loading && (
        <div className="suggestions-container animate-fade">
          <div className="flex items-center gap-sm" style={{ marginBottom: 20 }}>
            <Sparkles size={24} className="text-accent" />
            <h3>Your AI Recommendations</h3>
          </div>

          <div className="flex flex-col gap-md">
            {suggestions.map((item, i) => {
              const cat = SERVICE_CATEGORIES.find(c => c.id === item.category) || SERVICE_CATEGORIES[0];
              return (
                <motion.div
                  key={i}
                  className="card"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  style={{ borderLeft: `4px solid ${cat.color}` }}
                >
                  <div className="flex justify-between items-start" style={{ marginBottom: 8 }}>
                    <span className="badge" style={{ backgroundColor: `${cat.color}22`, color: cat.color }}>
                      {cat.icon} {cat.label}
                    </span>
                    <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>{item.impact} IMPACT</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: 8 }}>{item.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                    {item.description}
                  </p>
                  <div style={{ padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: 8, fontSize: '0.8rem' }}>
                    <strong>✨ Why it matches:</strong> {item.why}
                  </div>
                  <button className="btn btn-primary btn-sm w-full" style={{ marginTop: 16 }} onClick={() => navigate('/nearby')}>
                    Find Nearby
                  </button>
                </motion.div>
              );
            })}
          </div>

          <button className="btn btn-secondary w-full" style={{ marginTop: 24 }} onClick={reset}>
            <RefreshCw size={16} style={{ marginRight: 8 }} /> Redo Questionnaire
          </button>
        </div>
      )}

      <style>{`
        .icon-circle {
          width: 64px;
          height: 64px;
          border-radius: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }
        .progress-mini {
          height: 6px;
          background: var(--bg-elevated);
          border-radius: 3px;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
