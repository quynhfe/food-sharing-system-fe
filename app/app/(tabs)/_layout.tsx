// app/(tabs)/_layout.tsx
import { useEffect } from 'react';
import { CustomTabBar } from '@/components/ui/CustomTabBar';
import { Tabs } from 'expo-router';
import { useWishlistStore } from '@/features/wishlist/stores/wishlist.store';

export default function TabsLayout() {
  useEffect(() => {
    // Sync wishlist map from server on app load
    useWishlistStore.getState().fetchAllWishlistMap();
  }, []);

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Trang chủ' }} />
      <Tabs.Screen name="explore" options={{ title: 'Khám phá' }} />
      <Tabs.Screen name="create" options={{ title: 'Đăng' }} />
      <Tabs.Screen name="messages" options={{ title: 'Tin nhắn' }} />
      <Tabs.Screen name="profile" options={{ title: 'Hồ sơ' }} />
    </Tabs>
  );
}
