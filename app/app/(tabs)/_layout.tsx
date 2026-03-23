// app/(tabs)/_layout.tsx
import { CustomTabBar } from '@/components/ui/CustomTabBar';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
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
      <Tabs.Screen name="create" options={{ title: 'Đăng', href: null }} />
      <Tabs.Screen name="messages/index" options={{ title: 'Tin nhắn', href: null }} />
      <Tabs.Screen name="impact" options={{ title: 'Tác động' }} />
      <Tabs.Screen name="profile" options={{ title: 'Hồ sơ' }} />
    </Tabs>
  );
}