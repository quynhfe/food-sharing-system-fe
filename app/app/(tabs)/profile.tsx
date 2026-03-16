import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, ChevronRight, Settings, LogOut, Recycle, Globe, Users, Award, FileText, DownloadCloud, Activity } from 'lucide-react-native';

const MENU_ITEMS = [
  { label: 'Bài đăng của tôi', icon: FileText, color: '#3B82F6' },
  { label: 'Yêu cầu chờ lấy', icon: DownloadCloud, color: '#F59E0B' },
  { label: 'Lịch sử giao dịch', icon: Activity, color: '#10B981' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Cover Graphic Container - simulates banner */}
        <View className="h-32 bg-primary/20 relative w-full overflow-hidden items-center justify-center">
            <Text className="text-6xl opacity-20">🍃</Text>
        </View>

        {/* Profile Info Card over banner */}
        <View className="px-5 -mt-10">
          <View className="bg-white rounded-3xl p-5 border border-border-green shadow-sm shadow-black/5 items-center z-10">
            {/* Avatar */}
            <View className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center border-4 border-white shadow-sm shadow-black/5 -mt-12 mb-3 relative">
               <Text className="text-4xl text-primary font-bold">M</Text>
               <View className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full z-10" />
            </View>
            
            <View className="items-center mb-4 text-center w-full">
               <Text className="text-2xl font-black text-text-main tracking-tight">Minh Anh</Text>
               <Text className="text-sm font-semibold text-text-secondary mt-1">🌿 Thành viên tích cực</Text>
            </View>

            {/* Trust Score & Badges inline */}
            <View className="flex-row items-center gap-2">
              <View className="flex-row items-center gap-1.5 bg-surface px-4 py-2 rounded-full border border-border-green">
                <Star size={16} color="#2E7D32" fill="#2E7D32" />
                <Text className="text-primary font-bold text-sm">Trust: 94/100</Text>
              </View>
              <View className="w-8 h-8 rounded-full bg-warning/10 items-center justify-center border border-warning/20">
                <Award size={16} color="#d4a821" />
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 mt-6">
          <Text className="text-lg font-bold text-text-main mb-3">Tác động của bạn</Text>
          <View className="flex-row justify-between mb-6">
            {[
              { icon: <Recycle size={28} color="#2E7D32" />, value: '45.2', unit: 'kg', label: 'Thực phẩm' },
              { icon: <Globe size={28} color="#3b82f6" />, value: '112', unit: 'kg', label: 'CO₂ giảm' },
              { icon: <Users size={28} color="#f59e0b" />, value: '38', unit: 'người', label: 'Hỗ trợ' },
            ].map((stat, i) => (
              <View
                key={stat.label}
                className="bg-white rounded-2xl p-4 border border-border-green items-center w-[30%] shadow-sm shadow-black/5"
              >
                <View className="w-12 h-12 rounded-full bg-surface items-center justify-center mb-2">
                   {stat.icon}
                </View>
                <Text className="text-xl font-black text-text-main tracking-tighter">
                  {stat.value}<Text className="text-[10px] text-text-secondary tracking-normal ml-0.5">{stat.unit}</Text>
                </Text>
                <Text className="text-xs font-semibold text-text-secondary mt-1 text-center leading-tight">{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Menu Items */}
          <View className="bg-white rounded-3xl border border-border-green shadow-sm shadow-black/5 overflow-hidden mb-6">
            {MENU_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={item.label}
                  className={`p-4 flex-row items-center justify-between bg-white ${i !== MENU_ITEMS.length - 1 ? 'border-b border-border-green/50' : ''}`}
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                      <Icon size={20} color={item.color} />
                    </View>
                    <Text className="text-base font-bold text-text-main">{item.label}</Text>
                  </View>
                  <ChevronRight size={18} color="#9CA3AF" />
                </TouchableOpacity>
              );
            })}
          </View>
          
          <View className="bg-white rounded-3xl border border-border-green shadow-sm shadow-black/5 overflow-hidden mb-6">
            <TouchableOpacity className="p-4 flex-row items-center justify-between border-b border-border-green/50">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-xl bg-surface items-center justify-center">
                    <Settings size={20} color="#5a7a5a" />
                  </View>
                  <Text className="text-base font-bold text-text-main">Cài đặt tài khoản</Text>
                </View>
                <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>
            
            {/* Logout */}
            <TouchableOpacity className="p-4 flex-row items-center justify-between bg-white">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-xl bg-danger/10 items-center justify-center">
                     <LogOut size={20} color="#ef5350" />
                  </View>
                  <Text className="text-base font-bold text-danger">Đăng xuất</Text>
                </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
