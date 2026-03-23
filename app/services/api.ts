import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In Expo local development, use localhost for iOS simulator, 
// 10.0.2.2 for Android emulator, or your local IP for real devices.
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
