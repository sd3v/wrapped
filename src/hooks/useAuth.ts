import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth';

interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
  handleCallback: (code: string) => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check initial auth state
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await authService.getAccessToken();
        setIsAuthenticated(!!token);
      } catch (err) {
        console.error('Auth check failed:', err);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async () => {
    setError(null);
    try {
      await authService.login();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const handleCallback = useCallback(async (code: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.handleCallback(code);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    handleCallback,
  };
}

export default useAuth;

