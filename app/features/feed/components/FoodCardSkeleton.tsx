import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';

export function FoodCardSkeleton() {
  return (
    <View className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-4 h-[330px]">
      {/* Image Skeleton */}
      <View className="relative h-[200px] w-full bg-slate-100">
        <Skeleton className="w-full h-full rounded-none" />
        
        {/* Badge Skeleton */}
        <View className="absolute top-3 left-3">
          <Skeleton className="w-16 h-5 rounded-full" />
        </View>
        
        {/* Pagination Dots Skeleton */}
        <View className="absolute bottom-3 left-0 right-0 flex-row justify-center gap-1.5">
          <Skeleton className="w-4 h-1.5 rounded-full" />
          <Skeleton className="w-1.5 h-1.5 rounded-full" />
          <Skeleton className="w-1.5 h-1.5 rounded-full" />
        </View>
      </View>

      <View className="p-3.5 flex-1 justify-between">
        <View>
          {/* Title Skeleton */}
          <Skeleton className="w-[90%] h-4 rounded-md mb-2" />
          <Skeleton className="w-[60%] h-4 rounded-md mb-4" />
        </View>

        <View className="flex-col gap-3">
          {/* Avatar and Name */}
          <View className="flex-row items-center gap-2">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="w-20 h-3 rounded-md" />
          </View>

          {/* Distance and Time */}
          <View className="flex-row items-center justify-between">
            <Skeleton className="w-10 h-3 rounded-md" />
            <Skeleton className="w-10 h-3 rounded-md" />
          </View>
        </View>
      </View>
    </View>
  );
}
