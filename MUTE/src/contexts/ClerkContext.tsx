import React, { createContext, useContext, ReactNode } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useOAuth, useClerk, useUser  } from '@clerk/clerk-expo'; // Importa useClerk para manejar sesiones
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

  const signInWithGoogle = async () => {
    try {
      console.log("🔹 Iniciando Google Login...");

      const redirectUrl = Linking.createURL("/oauth-native");
      const { createdSessionId, setActive } = await startOAuthFlow({ redirectUrl });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });

        const user = session?.user;
        if (!user) {
          return;
        }

        console.log("✅ Usuario de Clerk obtenido:", user);


        const token = await session?.getToken();
        if (token) {
          await AsyncStorage.setItem("token", token);
        }

        await syncUserWithBackend(user);
      } else {
      }
    } catch (err) {
      console.error("❌ Error al iniciar sesión con Google:", err);
    }
  };

  const syncUserWithBackend = async (user: any) => {
    try {
      const response = await fetch("http://192.168.100.128:8000/auth/clerk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          nombre: user.fullName,
        }),
      });

      const result = await response.json();
      console.log("✅ Usuario sincronizado con el backend:", result);
    } catch (error) {
      console.error("❌ Error al sincronizar usuario con el backend:", error);
    }
  };

  const signOut = async () => {
    try {

      await AsyncStorage.removeItem("token"); 
      await AsyncStorage.removeItem("user_email");
      await clerkSignOut(); 

    } catch (err) {

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
