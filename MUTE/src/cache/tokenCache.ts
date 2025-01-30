import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { TokenCache } from '@clerk/clerk-expo/dist/cache';

const createTokenCache = (): TokenCache => {
  return {
    getToken: async (key: string) => {
      try {
        const item = await SecureStore.getItemAsync(key);
        if (item) {
          console.log(` Token recuperado para ${key}`);
        } else {
          console.log(` No hay token almacenado para ${key}`);
        }
        return item;
      } catch (error) {
        console.error('Error al obtener token:', error);
        return null;
      }
    },
    saveToken: async (key: string, token: string) => {
      try {
        await SecureStore.setItemAsync(key, token);
        console.log(` Token guardado para ${key}`);
      } catch (error) {
        console.error('Error al guardar token:', error);
      }
    },
  };
};

export const tokenCache = Platform.OS !== 'web' ? createTokenCache() : undefined;
