import React, { createContext, useContext, ReactNode } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useOAuth, useClerk, useAuth } from '@clerk/clerk-expo'; // Importa useClerk para manejar sesiones
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ClerkContextProps {
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const ClerkContext = createContext<ClerkContextProps | undefined>(undefined);

interface ClerkAuthProviderProps {
  children: ReactNode;
}

WebBrowser.maybeCompleteAuthSession();

export const ClerkAuthProvider: React.FC<ClerkAuthProviderProps> = ({ children }) => {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { session, signOut: clerkSignOut } = useClerk();

  // Función para iniciar sesión con Google
  const signInWithGoogle = async () => {
    try {
      // Si ya hay una sesión activa, cierra la sesión primero
      if (session) {
        await signOut();
      }

      const redirectUrl = Linking.createURL('/oauth-native');
      const { createdSessionId, setActive } = await startOAuthFlow({ redirectUrl });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        await AsyncStorage.setItem('token', createdSessionId);
        console.log('Google login successful');
      } else {
        console.error('Failed to get Clerk session');
      }
    } catch (err) {
      console.error('Error logging in with Google:', JSON.stringify(err, null, 2));
    }
  };

  // Función para cerrar sesión
  const signOut = async () => {
    try {
      console.log("🔹 Cerrando sesión en Clerk...");
  
      await AsyncStorage.removeItem("token"); // Asegurar que el token no quede guardado
      await clerkSignOut(); // Cerrar sesión en Clerk
  
      console.log("✅ Sesión cerrada correctamente en Clerk.");
    } catch (err) {
      console.error("❌ Error al cerrar sesión en Clerk:", err);
    }
  };

  return (
    <ClerkContext.Provider value={{ signInWithGoogle, signOut }}>
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
