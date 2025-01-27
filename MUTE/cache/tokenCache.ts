import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { TokenCache } from '@clerk/clerk-expo/dist/cache';

const createTokenCache = (): TokenCache => {
  return {
    getToken: async (key: string) => {
      try {
        const item = await SecureStore.getItemAsync(key);
        return item;
      } catch (error) {
        console.error('Error getting token: ', error);
        await SecureStore.deleteItemAsync(key);
        return null;
      }
    },
    saveToken: async (key: string, token: string) => {
      await SecureStore.setItemAsync(key, token);
    },
    clearToken: async (key: string) => {
      await SecureStore.deleteItemAsync(key);
    },
  };
};

export const tokenCache = Platform.OS !== 'web' ? createTokenCache() : undefined;
