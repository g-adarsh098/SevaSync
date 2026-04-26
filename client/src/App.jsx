import { createContext, useContext, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/common/BottomNav';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import NearbyNeedsPage from './pages/NearbyNeedsPage';
import AISuggestionPage from './pages/AISuggestionPage';
import ProfilePage from './pages/ProfilePage';
import TaskDetailPage from './pages/TaskDetailPage';
import TasksPage from './pages/TasksPage';
import MatchingPage from './pages/MatchingPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import ChatRoomPage from './pages/ChatRoomPage';
import './App.css';

// Create Demo Mode Context
const DemoContext = createContext({ demoMode: false, demoUser: null });
export const useDemoMode = () => useContext(DemoContext);

function App() {
  const { user, loading } = useAuth();
  const [demoMode, setDemoMode] = useState(false);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">
          <span className="gradient-text">Seva</span>Sync
        </div>
        <div className="spinner" />
        <p>Loading your experience...</p>
      </div>
    );
  }

  const isAuthenticated = !!user;

  // Mock demo user
  const demoUser = {
    uid: 'demo-user-123',
    displayName: 'Demo Volunteer',
    email: 'demo@example.com',
    role: 'volunteer',
    points: 1250,
    hoursContributed: 45,
    badges: ['first_task', 'streak_7', 'healer']
  };

  return (
    <DemoContext.Provider value={{ demoMode, setDemoMode, demoUser }}>
      <div className="app">
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" />} />
          
          {/* Protected Routes */}
          <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/nearby" element={isAuthenticated ? <NearbyNeedsPage /> : <Navigate to="/login" />} />
          <Route path="/analytics" element={isAuthenticated ? <AISuggestionPage /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/tasks" element={isAuthenticated ? <TasksPage /> : <Navigate to="/login" />} />
          <Route path="/tasks/:id" element={isAuthenticated ? <TaskDetailPage /> : <Navigate to="/login" />} />
          <Route path="/matching" element={isAuthenticated ? <MatchingPage /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="/chat" element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} />
          <Route path="/chat/:id" element={isAuthenticated ? <ChatRoomPage /> : <Navigate to="/login" />} />
          
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
        </Routes>
        {isAuthenticated && <BottomNav />}
      </div>
    </DemoContext.Provider>
  );
}

export default App;
