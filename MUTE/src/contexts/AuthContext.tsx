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

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error('Error verificando el token:', error);
      }
    };
    checkToken();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await axios.post('http:// 192.168.100.128:8000/auth/login', {
        email,
        password,
      });

      const token = response.data.token;

      // Almacenar el token en AsyncStorage
      await AsyncStorage.setItem('token', token);

      setIsAuthenticated(true);
      console.log('Login exitoso');
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error.response?.data?.detail || error.message);
      throw new Error(error.response?.data?.detail || 'Error al iniciar sesión');
    }
  };

  const signUp = () => {
    console.log('Redirect to sign-up page');
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setIsAuthenticated(false);
      console.log('Cierre de sesión exitoso');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
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