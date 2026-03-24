import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Linking, Platform } from "react-native";
import { router } from "expo-router";
import { getCategoryIcon, getCategoryColor } from "../utils/map.utils";

interface MapCarouselProps {
  selectedCluster: any[];
  userLocation?: { latitude: number; longitude: number };
  onNavigateInApp?: (coords: { latitude: number; longitude: number }) => void;
}

const openDirections = async (
  destinationLat: number,
  destinationLon: number,
  origin?: { latitude: number; longitude: number }
) => {
  const destination = `${destinationLat},${destinationLon}`;
  const googleUrl = origin
    ? `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destination}&travelmode=driving`
    : `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
  const appleUrl = origin
    ? `http://maps.apple.com/?saddr=${origin.latitude},${origin.longitude}&daddr=${destination}&dirflg=d`
    : `http://maps.apple.com/?daddr=${destination}&dirflg=d`;

  const primary = Platform.OS === "ios" ? appleUrl : googleUrl;
  const fallback = Platform.OS === "ios" ? googleUrl : appleUrl;

  const canOpenPrimary = await Linking.canOpenURL(primary);
  if (canOpenPrimary) {
    await Linking.openURL(primary);
    return;
  }
  await Linking.openURL(fallback);
};

export const MapCarousel: React.FC<MapCarouselProps> = ({
  selectedCluster,
  userLocation,
  onNavigateInApp,
}) => {
  if (!selectedCluster || selectedCluster.length === 0) return null;

  return (
    <View className="absolute bottom-6 left-0 right-0 z-20" pointerEvents="box-none">
      <View className="px-4 pb-2" pointerEvents="none">
        <View className="bg-white/90 backdrop-blur-md self-start px-3 py-1 rounded-full mb-2 border border-slate-100 shadow-sm">
           <Text className="text-xs font-bold text-slate-700">{selectedCluster.length} bài viết tại vị trí này</Text>
        </View>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
      >
        {selectedCluster.map(post => {
          const hasImage = post.images && post.images.length > 0;
          const coords = post?.location?.coordinates?.coordinates;
          const hasCoords =
            Array.isArray(coords) &&
            coords.length === 2 &&
            typeof coords[0] === "number" &&
            typeof coords[1] === "number";
          return (
            <TouchableOpacity
              key={post._id} 
              activeOpacity={0.9}
              onPress={() => router.push(`/food/${post._id}` as any)}
              className="bg-white rounded-2xl w-72 p-3 shadow-lg border border-slate-100 flex-row gap-3"
            >
              <View className={`w-14 h-14 rounded-xl items-center justify-center ${hasImage ? 'bg-slate-100' : getCategoryColor(post.category)} overflow-hidden`}>
                {hasImage ? (
                  <Image source={{ uri: post.images[0] }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                ) : (
                  getCategoryIcon(post.category)
                )}
              </View>
              <View className="flex-1 justify-center">
                <Text className="font-bold text-slate-800 text-sm mb-1" numberOfLines={2}>{post.title}</Text>
                <Text className="text-xs text-slate-500 font-medium" numberOfLines={1}>Bởi: {post.donorId?.fullName || "Ẩn danh"}</Text>
                <TouchableOpacity
                  disabled={!hasCoords}
                  activeOpacity={0.85}
                  onPress={() => {
                    if (!hasCoords) return;
                    const [lon, lat] = coords as [number, number];
                    if (onNavigateInApp) {
                      onNavigateInApp({ latitude: lat, longitude: lon });
                      return;
                    }
                    openDirections(lat, lon, userLocation);
                  }}
                  className={`mt-2 self-start px-3 py-1.5 rounded-full border ${
                    hasCoords ? "bg-emerald-50 border-emerald-200" : "bg-slate-100 border-slate-200"
                  }`}
                >
                  <Text className={`text-xs font-bold ${hasCoords ? "text-emerald-700" : "text-slate-400"}`}>
                    Chỉ đường
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
