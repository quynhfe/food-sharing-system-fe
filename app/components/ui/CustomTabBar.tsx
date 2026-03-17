// components/ui/CustomTabBar.tsx
import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Text } from './text';
import { Home, Compass, PlusCircle, MessageCircle, User } from 'lucide-react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();

    const icons = {
        index: Home,
        explore: Compass,
        create: PlusCircle,
        messages: MessageCircle,
        profile: User,
    };

    return (
        <View
            className="absolute bottom-0 left-0 right-0 bg-white flex-row justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.08)] border-t border-slate-100/50"
            style={{
                paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 24 : 16),
                paddingTop: 12,
                paddingHorizontal: 16
            }}
        >
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.title !== undefined ? options.title : route.name;
                const isFocused = state.index === index;
                const Icon = icons[route.name as keyof typeof icons] || Home;
                const isCenter = route.name === 'create';

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                if (isCenter) {
                    return (
                        <TouchableOpacity
                            key={index}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            onPress={onPress}
                            activeOpacity={0.9}
                            className="flex-col items-center justify-center -mt-10"
                        >
                            <View className="w-14 h-14 bg-[#2E7D32] rounded-full items-center justify-center shadow-lg shadow-[#2E7D32]/40 border-4 border-[#F8FAF8]">
                                <Icon size={24} color="white" />
                            </View>
                            <Text className="text-[10px] font-bold text-slate-500 mt-1">{label as string}</Text>
                        </TouchableOpacity>
                    );
                }

                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        onPress={onPress}
                        activeOpacity={0.7}
                        className="flex-1 flex-col items-center justify-center gap-1.5"
                    >
                        <Icon size={24} color={isFocused ? '#2E7D32' : '#94A3B8'} strokeWidth={isFocused ? 2.5 : 2} />
                        <Text className={`text-[10px] uppercase tracking-wider ${isFocused ? 'font-bold text-[#2E7D32]' : 'font-medium text-slate-400'}`}>
                            {label as string}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}