import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { id: string; email: string } | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Restore session on mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem('admin_token');
    const storedUser = sessionStorage.getItem('admin_user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Failed to restore session:', err);
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch('/.netlify/functions/auth-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        return { success: false, error: data.error || 'Login failed' };
      }

      // Store token and user
      sessionStorage.setItem('admin_token', data.token);
      sessionStorage.setItem('admin_user', JSON.stringify(data.user));
      
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);

      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      sessionStorage.removeItem('admin_token');
      sessionStorage.removeItem('admin_user');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
