import React, { createContext, useContext, ReactNode } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useOAuth } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ClerkContextProps {
  signInWithGoogle: () => Promise<void>;
}

const ClerkContext = createContext<ClerkContextProps | undefined>(undefined);

interface ClerkAuthProviderProps {
  children: ReactNode;
}

WebBrowser.maybeCompleteAuthSession();

export const ClerkAuthProvider: React.FC<ClerkAuthProviderProps> = ({ children }) => {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const signInWithGoogle = async () => {
    try {
      const redirectUrl = Linking.createURL('/oauth-native');
      const { createdSessionId, setActive } = await startOAuthFlow({ redirectUrl });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        await AsyncStorage.setItem('token', createdSessionId);
        console.log('Inicio de sesión con Google exitoso');
      } else {
        console.error('No se pudo obtener la sesión de Clerk');
      }
    } catch (err) {
      console.error('Error al iniciar sesión con Google:', JSON.stringify(err, null, 2));
    }
  };

  return (
    <ClerkContext.Provider value={{ signInWithGoogle }}>
      {children}
    </ClerkContext.Provider>
  );
};

export const useClerkAuth = (): ClerkContextProps => {
  const context = useContext(ClerkContext);
  if (!context) {
    throw new Error('useClerkAuth must be used within a ClerkAuthProvider');
  }
  return context;
};
