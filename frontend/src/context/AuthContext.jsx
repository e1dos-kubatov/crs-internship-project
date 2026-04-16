import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

const login = async (email, password) => {
    // Strict validation
    if (email === 'admin@admin.com') {
      if (password === 'admin') {
        const adminUser = { id: 1, email, role: 'admin', name: 'Admin' };
        localStorage.setItem('user', JSON.stringify(adminUser));
        setUser(adminUser);
        return { success: true };
      } else {
        return { success: false, error: 'Неверный пароль для админа' };
      }
    } else if (email && password && password.length >= 3) {
      const clientUser = { id: Math.random(), email, role: 'client', name: email.split('@')[0], registered: new Date().toISOString() };
      localStorage.setItem('user', JSON.stringify(clientUser));
      // Add to global users list
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (!users.find(u => u.email === email)) {
        users.push(clientUser);
        localStorage.setItem('users', JSON.stringify(users));
      }
      setUser(clientUser);
      return { success: true };
    } else {
      return { success: false, error: 'Введите корректный email и пароль (минимум 3 символа)' };
    }
  };

  const register = async (name, email, phone, password) => {
    // Fake register
    const user = { 
      id: Date.now(), 
      name, 
      email, 
      phone, 
      role: 'client',
      registered: new Date().toISOString()
    };
    localStorage.setItem('user', JSON.stringify(user));
    // Add to global users list
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (!users.find(u => u.email === email)) {
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
    }
    setUser(user);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

