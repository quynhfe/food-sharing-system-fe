import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// In-memory fallback if AsyncStorage native module fails (e.g. Expo Go mismatch or Web issues)
const memoryStorage: Record<string, string> = {};

export const storage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      console.log(`[SafeStorage] Fallback to memory for getItem(${key})`);
      return memoryStorage[key] || null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log(`[SafeStorage] Fallback to memory for setItem(${key})`);
      memoryStorage[key] = value;
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log(`[SafeStorage] Fallback to memory for removeItem(${key})`);
      delete memoryStorage[key];
    }
  }
};
