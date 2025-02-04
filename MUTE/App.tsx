import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext'; // Autenticación
import { ClerkProvider } from '@clerk/clerk-expo'; // Clerk para autenticación
import { ClerkAuthProvider } from './src/contexts/ClerkContext'; // Contexto de Clerk
import { ThemeProvider } from './src/contexts/ThemeContext'; // Contexto para tema
import { CartProvider } from "./src/contexts/CartContext"; 

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  );
}

const App: React.FC = () => {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <ClerkAuthProvider>
        <AuthProvider>
          <ThemeProvider>
          <CartProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </ClerkAuthProvider>
    </ClerkProvider>
  );
};

export default App;