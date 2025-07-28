import { api } from '@/services/api';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialiser le token depuis sessionStorage
  useEffect(() => {
    const storedToken = sessionStorage.getItem('bigscreen_admin_token');
    if (storedToken) {
      setToken(storedToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const authToken = response.data.token || response.data.access_token;
      if (!authToken || authToken === 'undefined' || authToken.trim() === '') {
        return false;
      }
      setToken(authToken);
      sessionStorage.setItem('bigscreen_admin_token', authToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    sessionStorage.removeItem('bigscreen_admin_token');
    delete api.defaults.headers.common['Authorization'];
  };

  const value: AuthContextType = {
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}