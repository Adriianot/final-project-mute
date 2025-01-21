import React, { createContext, useState, ReactNode } from 'react';

interface AuthContextProps {
  signIn: (email: string, password: string) => void;
  signUp: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const signIn = (email: string, password: string) => {
    console.log('Signing in:', email);
  };

  const signUp = () => {
    console.log('Redirect to sign-up page');
  };

  return (
    <AuthContext.Provider value={{ signIn, signUp }}>
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
