import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string } | null;
  login: () => void;
  logout: () => void;
  toggleAuth: () => void; // Added for testing toggle
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);

  const login = () => {
    setIsAuthenticated(true);
    setUser({ name: 'Test User' }); // Mock user data
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  // Toggle function for testing
  const toggleAuth = () => {
    if (isAuthenticated) {
      logout();
    } else {
      login();
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, toggleAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
