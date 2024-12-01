import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';

// Define the JWT payload interface
interface JWTPayload {
  userId: string;
  email: string;
  userType: string;
  organizationId: string;
  iat: number;
  exp: number;
}

// Update the context type to include decoded token info
interface AuthContextType {
  isAuthenticated: boolean;
  user: JWTPayload | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<JWTPayload | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/auth/me');
      console.log('Auth Status Response:', response.data);
      
      if (response.data.success) {
        setUser(response.data.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });

      
      // Return early if the response indicates failure
      if (response.data.success===false) {
        setUser(null);
        setIsAuthenticated(false);
        return response.data; // Return the response data for error handling
      }

      // Handle successful login
      setUser(response.data.data.user);
      setIsAuthenticated(true);
      return response.data;
    } catch (error: any) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user,
      login,
      logout,
      isLoading
    }}>
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

// Utility function to get user roles/permissions
export const useUserRole = () => {
  const { user } = useAuth();
  return user?.userType || null;
};

// Example usage of how to access user data in components:
/*
import { useAuth, useUserRole } from '../context/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const userRole = useUserRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <p>Your role is: {userRole}</p>
      <p>Organization: {user?.organizationId}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
*/ 