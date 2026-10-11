import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthForm from './components/AuthForm';
import AdminDashboard from './components/AdminDashboard';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import UpcomingEvents from './components/UpcomingEvents';
import EventList from './components/EventList';
import MyEvents from './components/MyEvents';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) return <div className="text-center mt-5">Loading Dashboard...</div>;
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="text-center mt-5">Loading...</div>;

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/'} replace />;
  }
  return children;
};

const AppContent = () => {
  const { user, logout } = useAuth();

  return (
    <Router>
      <Header user={user} handleLogout={logout} />
      <div className="container mt-4" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home user={user} /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          <Route path="/login" element={<AuthRoute><AuthForm /></AuthRoute>} />
          <Route path="/signup" element={<AuthRoute><AuthForm /></AuthRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/upcoming" element={<ProtectedRoute><UpcomingEvents /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><EventList /></ProtectedRoute>} />
          <Route path="/my-events" element={<ProtectedRoute><MyEvents /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
