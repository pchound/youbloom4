import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user was previously logged in using sessionStorage
    const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    setIsAuthenticated(loggedIn);
    setLoading(false);
  }, []);

  const login = (phoneNumber) => {
    // Mock login logic - accept +254712345678 as valid
    if (phoneNumber === '+254712345678') {
      setIsAuthenticated(true);
      sessionStorage.setItem('isLoggedIn', 'true');
      return { success: true };
    }
    return { success: false, error: 'Invalid phone number. Use +254712345678' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isLoggedIn');
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};