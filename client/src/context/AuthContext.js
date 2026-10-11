import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('accessToken'); 

      if (storedUser && token) {
        setUser({ ...storedUser, token });
      }
    } catch (error) {
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (data) => {
    if (!data || !data.user || !data.accessToken) return;

    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('accessToken', data.accessToken); 
    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
    if (data.user.role) localStorage.setItem('role', data.user.role);

    setUser({ ...data.user, token: data.accessToken });
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken'); 
    localStorage.removeItem('refreshToken'); 
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
