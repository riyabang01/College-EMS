import React, { useState, useEffect } from 'react';
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
import { AuthProvider } from './context/AuthContext';


const App = () => {
  const [user, setUser] = useState(null);

  
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    
    if (accessToken && role) {
      setUser({ token: accessToken, role });
    }
  }, []);

 
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    setUser(null);  
  };

 
  const ProtectedRoute = ({ children, role }) => {
    const location = useLocation();
    
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (role && user.role !== role) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  
  const AuthRoute = ({ children }) => {
    if (user) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <AuthProvider>
    <Router>
      <Header user={user} handleLogout={handleLogout} />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home user={user} /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          <Route path="/login" element={<AuthRoute><AuthForm setUser={setUser} /></AuthRoute>} />
          <Route path="/signup" element={<AuthRoute><AuthForm setUser={setUser} /></AuthRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/upcoming-events" element={<ProtectedRoute><UpcomingEvents /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><EventList /></ProtectedRoute>} />
          <Route path="/my-events" element={<ProtectedRoute><MyEvents /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </Router>
    </AuthProvider>
  );
};

export default App;
