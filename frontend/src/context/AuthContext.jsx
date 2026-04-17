import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi, setToken, getToken } from '../api/client';
import { normalizeUser } from '../api/adapters';

const AuthContext = createContext();
const USER_KEY = 'carRentalUser';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistUser = useCallback((nextUser) => {
    const normalized = normalizeUser(nextUser);
    localStorage.setItem(USER_KEY, JSON.stringify(normalized));
    setUser(normalized);
    return normalized;
  }, []);

  const loadCurrentUser = useCallback(async () => {
    const currentUser = await authApi.me();
    return persistUser(currentUser);
  }, [persistUser]);

  useEffect(() => {
    const boot = async () => {
      const params = new URLSearchParams(window.location.search);
      const oauthToken = params.get('token');
      const oauthState = params.get('oauth');

      try {
        if (oauthToken) {
          setToken(oauthToken);
          await loadCurrentUser();
          params.delete('token');
          params.delete('oauth');
          const nextSearch = params.toString();
          window.history.replaceState({}, document.title, `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}`);
        } else if (oauthState === 'error') {
          setToken(null);
          localStorage.removeItem(USER_KEY);
        } else if (getToken()) {
          await loadCurrentUser();
        } else {
          const savedUser = localStorage.getItem(USER_KEY);
          if (savedUser) setUser(JSON.parse(savedUser));
        }
      } catch {
        setToken(null);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    boot();
  }, [loadCurrentUser]);

  const login = async (email, password) => {
    try {
      const response = await authApi.login({ email, password });
      setToken(response.token);
      const currentUser = await loadCurrentUser();
      return { success: true, user: currentUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await authApi.register({ name, email, password });
      setToken(response.token);
      const currentUser = await loadCurrentUser();
      return { success: true, user: currentUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loginWithOAuth = async (provider) => {
    const status = await authApi.oauthStatus();
    if (!status?.[provider]) {
      throw new Error(`${provider} OAuth is not configured on the backend.`);
    }
    window.location.href = authApi.oauthUrl(provider);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithOAuth, logout, loading, refreshUser: loadCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
