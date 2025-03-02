import React, { createContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface AuthContextProps {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: () => void;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if a token exists when loading the application
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error('Error verifying token:', error);
      }
    };
    checkToken();
  }, []);

  // Login function
  const signIn = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://52.70.33.203:8000/auth/login', {
        email,
        password,
      });

      const token = response.data.token;

      // Store the token in AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem("user_email", email); 
      setIsAuthenticated(true);
      console.log('Login successful');
    } catch (error: any) {
      console.error('Error logging in:', error.response?.data?.detail || error.message);
      throw new Error(error.response?.data?.detail || 'Error logging in');
    }
  };

  // Function to redirect to the registry (not implemented)
  const signUp = () => {
    console.log('Redirect to sign-up page');
  };

  // Logout function
  const signOut = async () => {
    try {
      console.log("🔹 Logging out of AuthProvider...");
  
      await AsyncStorage.removeItem("token"); // Delete token
      await AsyncStorage.removeItem("user_email");
      setIsAuthenticated(false); // Change authentication status
  
      console.log("✅ AuthProvider Logout Successful.");
    } catch (error) {
      console.error("❌ Error logging out of AuthProvider:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ signIn, signUp, signOut, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
