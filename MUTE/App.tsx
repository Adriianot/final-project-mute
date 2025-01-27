import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext'; // Autenticación por email
import { ClerkProvider } from '@clerk/clerk-expo'; // Clerk para Google OAuth
import { ClerkAuthProvider } from './src/contexts/ClerkContext'; 

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}

const App: React.FC = () => {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <ClerkAuthProvider> 
        <AuthProvider> 
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </AuthProvider>
      </ClerkAuthProvider>
    </ClerkProvider>
  );
};

export default App;