import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const AuthContext = createContext(null);
const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch { return null; }
};

const isTokenValid = (token) => {
  const payload = parseJwt(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 > Date.now();
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_user');
    // Reject expired tokens on startup
    if (token && user && isTokenValid(token)) {
      return { token, user: JSON.parse(user) };
    }
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    return null;
  });

  const idleTimer = useRef(null);

  const clearSession = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAuth(null);
  }, []);

  const resetIdleTimer = useCallback(() => {
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(clearSession, IDLE_TIMEOUT_MS);
  }, [clearSession]);

  useEffect(() => {
    if (!auth) return;
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(e => window.addEventListener(e, resetIdleTimer, { passive: true }));
    resetIdleTimer();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetIdleTimer));
      clearTimeout(idleTimer.current);
    };
  }, [auth, resetIdleTimer]);

  // Proactive token expiry check every minute
  useEffect(() => {
    if (!auth) return;
    const interval = setInterval(() => {
      if (!isTokenValid(auth.token)) clearSession();
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [auth, clearSession]);

  const login = (token, user) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(user));
    setAuth({ token, user });
  };

  const logout = clearSession;

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
