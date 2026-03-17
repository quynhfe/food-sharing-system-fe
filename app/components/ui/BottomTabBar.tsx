// components/ui/BottomTabBar.tsx
import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Text } from './text';
import { Home, Compass, PlusCircle, MessageCircle, User } from 'lucide-react-native';

interface BottomTabBarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'home', icon: Home, label: 'Trang chủ' },
        { id: 'explore', icon: Compass, label: 'Khám phá' },
        { id: 'post', icon: PlusCircle, label: 'Đăng', isCenter: true },
        { id: 'chat', icon: MessageCircle, label: 'Tin nhắn' },
        { id: 'profile', icon: User, label: 'Hồ sơ' },
    ];

    return (
        <View
            className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex-row justify-between items-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
            style={{ paddingBottom: Platform.OS === 'ios' ? 24 : 12, paddingTop: 12, paddingHorizontal: 24 }}
        >
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                if (tab.isCenter) {
                    return (
                        <TouchableOpacity key={tab.id} onPress={() => onTabChange(tab.id)} className="flex-col items-center -mt-10">
                            <View className="w-14 h-14 bg-[#2E7D32] rounded-full items-center justify-center shadow-lg shadow-[#2E7D32]/40 border-4 border-[#F8FAF8]">
                                <Icon size={24} color="white" />
                            </View>
                            <Text className="text-[10px] font-bold text-slate-500 mt-1">{tab.label}</Text>
                        </TouchableOpacity>
                    );
                }

                return (
                    <TouchableOpacity key={tab.id} onPress={() => onTabChange(tab.id)} className="flex-col items-center gap-1.5">
                        <Icon size={24} color={isActive ? '#2E7D32' : '#94A3B8'} strokeWidth={isActive ? 2.5 : 2} />
                        <Text className={`text-[10px] uppercase tracking-wider ${isActive ? 'font-bold text-[#2E7D32]' : 'font-medium text-slate-400'}`}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};