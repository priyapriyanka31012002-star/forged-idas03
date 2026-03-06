import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const DEMO_USERS = [
  { id: 1, name: 'Admin User', email: 'admin@forgedas.com', role: 'admin', password: 'admin1234' },
  { id: 2, name: 'John Engineer', email: 'john@forgedas.com', role: 'engineer', password: 'eng123' },
  { id: 3, name: 'Sarah Sales', email: 'sarah@forgedas.com', role: 'sales', password: 'sales123' },
  { id: 4, name: 'Mike Production', email: 'mike@forgedas.com', role: 'production', password: 'prod123' },
  { id: 5, name: 'Lisa Quality', email: 'lisa@forgedas.com', role: 'quality', password: 'qual123' },
  { id: 6, name: 'Tom Logistics', email: 'tom@forgedas.com', role: 'logistics', password: 'log123' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('forgedas_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const userData = { id: found.id, name: found.name, email: found.email, role: found.role };
      setUser(userData);
      localStorage.setItem('forgedas_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('forgedas_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
