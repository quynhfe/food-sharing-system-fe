import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { MapPin, Clock, Star } from 'lucide-react-native';
import type { FeedFilterType } from '../types';

interface FilterChipsProps {
  activeFilter: FeedFilterType;
  onSelectFilter: (filter: FeedFilterType) => void;
}

export function FilterChips({ activeFilter, onSelectFilter }: FilterChipsProps) {
  const chips: { id: FeedFilterType; label: string; icon: any }[] = [
    { id: 'newest', label: 'Mới nhất', icon: Star },
    { id: 'nearby', label: 'Gần bạn', icon: MapPin },
    { id: 'expiring', label: 'Sắp hết hạn', icon: Clock },
  ];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={{ gap: 12, paddingHorizontal: 24 }}
      className="pb-6" // Padding bottom to separate from feed
    >
      {chips.map((chip) => {
        const Icon = chip.icon;
        const isActive = activeFilter === chip.id;
        
        return (
          <TouchableOpacity 
            key={chip.id}
            onPress={() => onSelectFilter(chip.id)}
            className={`flex-row items-center gap-2 px-5 py-3 rounded-2xl border ${
              isActive 
                ? 'bg-[#2E7D32] border-[#2E7D32]' 
                : 'bg-white border-slate-200'
            }`} 
            activeOpacity={0.8}
          >
            <Icon size={18} color={isActive ? "white" : "#64748B"} />
            <Text className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-600'}`}>
              {chip.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
