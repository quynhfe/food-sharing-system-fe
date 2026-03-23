// app/_layout.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { queryClient } from '@/lib/query-client';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="food/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="messages/[id]" options={{ presentation: 'card', animation: 'slide_from_right' }} />
        <Stack.Screen name="request/[id]" options={{ presentation: 'card', animation: 'slide_from_right' }} />
        <Stack.Screen name="request/me" options={{ presentation: 'card', animation: 'slide_from_right' }} />
        <Stack.Screen name="profile/[id]" options={{ presentation: 'card', animation: 'slide_from_right' }} />
        <Stack.Screen name="food/favorites" options={{ presentation: 'card', animation: 'slide_from_right' }} />
      </Stack>
    </QueryClientProvider>
  );
}