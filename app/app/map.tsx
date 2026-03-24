import React, { useState, useMemo } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from "@/features/map/components/MapProvider";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Text } from "@/components/ui/text";
import { RefreshCw, ArrowLeft, MapPin } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from 'expo-location';
import Constants from "expo-constants";

import { PostService } from "@/features/post/services/post.service";
import { ClusterIcon } from "@/features/map/components/ClusterIcon";
import { MapCarousel } from "@/features/map/components/MapCarousel";
import { getJitteredCoord } from "@/features/map/utils/map.utils";
import MapDirections from "@/features/map/components/MapDirections";

// Default region: Da Nang, Vietnam
const INITIAL_REGION = {
  latitude: 16.0678,
  longitude: 108.2208,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05
};

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = React.useRef<any>(null);

  // We store the user location once fetched
  const [userLocation, setUserLocation] = useState(INITIAL_REGION);
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<any[] | null>(null);
  const [routeDestination, setRouteDestination] = useState<{ latitude: number; longitude: number } | null>(null);
  const [routeMeta, setRouteMeta] = useState<{ distance: number; duration: number } | null>(null);
  const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || Constants.expoConfig?.extra?.googleMapsApiKey || "";

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationLoaded(true);
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        const newRegion = {
          ...INITIAL_REGION,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(newRegion);
        
        // Animate map natively to new location without re-rendering MapView entirely
        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }
      } catch (e) {
        console.log("Error fetching location", e);
      } finally {
        setLocationLoaded(true);
      }
    })();
  }, []);

  // Fetch posts initially around userLocation, but don't re-fetch during pan/zoom
  // to avoid bridging crashes on Apple Maps (iOS). Use a larger radius (e.g. 50km).
  const {
    data: response,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["postsMap", userLocation.latitude, userLocation.longitude],
    queryFn: () =>
      PostService.getPostsForMap({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        radius: 50000 // 50km to cover broad area so no need to refetch on every pan
      }),
    enabled: locationLoaded 
  });

  const posts = response?.data || [];

  const groupedPosts = useMemo(() => {
    const groups: Record<string, any[]> = {};
    posts.forEach((post: any) => {
      if (!post.location?.coordinates) return;
      const [lon, lat] = post.location.coordinates.coordinates;
      const key = `${lon},${lat}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(post);
    });
    return Object.values(groups);
  }, [posts]);

  const hasPostAtUserLocation = useMemo(() => {
    return groupedPosts.some(cluster => {
      const [lon, lat] = cluster[0].location.coordinates.coordinates;
      return Math.abs(lat - userLocation.latitude) < 0.00001 && Math.abs(lon - userLocation.longitude) < 0.00001;
    });
  }, [groupedPosts, userLocation]);

  return (
    <View className="flex-1 bg-white">
      <View
        className="absolute top-0 left-0 right-0 z-10  bg-white/90 backdrop-blur-md px-6 pb-5"
        style={{ paddingTop: Math.max(insets.top, 16) }}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center"
              activeOpacity={0.7}>
              <ArrowLeft
                size={20}
                color="#334155"
              />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-extrabold text-slate-800">
                Bản đồ thực phẩm
              </Text>
              <Text className="text-sm font-medium text-slate-500">
                {isLoading || isRefetching || !locationLoaded
                  ? "Đang tìm kiếm..."
                  : `Tìm thấy ${posts.length} món ăn quanh đây`}
              </Text>
              {routeMeta ? (
                <Text className="text-xs font-semibold text-emerald-700 mt-1">
                  Tuyến: {routeMeta.distance.toFixed(1)} km - {Math.round(routeMeta.duration)} phút
                </Text>
              ) : null}
            </View>
          </View>
          <TouchableOpacity
            onPress={() => refetch()}
            className="w-10 h-10 rounded-full bg-[#E8F5E9] items-center justify-center"
            activeOpacity={0.7}>
            <RefreshCw
              size={18}
              color="#2E7D32"
            />
          </TouchableOpacity>
        </View>
        {routeDestination ? (
          <TouchableOpacity
            onPress={() => {
              setRouteDestination(null);
              setRouteMeta(null);
            }}
            className="mt-3 self-start bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full"
            activeOpacity={0.8}
          >
            <Text className="text-xs font-bold text-slate-700">Ẩn tuyến đường</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={INITIAL_REGION}
        showsUserLocation={false} 
        showsMyLocationButton={false}
        onPress={() => setSelectedCluster(null)} // Dismiss selection when tapping map empty space
      >
        {/* Current User Location Marker */}
        {!hasPostAtUserLocation && (
          <Marker 
            coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }} 
            zIndex={999}
          >
            <View className="items-center justify-center">
              <View className="bg-red-500 p-2 rounded-full border-2 border-white shadow-lg">
                <MapPin size={20} color="white" />
              </View>
              <View className="absolute bg-red-500/20 w-12 h-12 rounded-full -z-10" />
            </View>
          </Marker>
        )}

        {groupedPosts.map((cluster, index) => {
          const [lon, lat] = cluster[0].location.coordinates.coordinates;
          const isUserLoc = Math.abs(lat - userLocation.latitude) < 0.00001 && Math.abs(lon - userLocation.longitude) < 0.00001;

          return (
            <Marker
              key={`cluster-${index}`}
              coordinate={{ latitude: lat, longitude: lon }}
              zIndex={isUserLoc ? 800 : index}
              onPress={(e) => {
                e.stopPropagation();
                setSelectedCluster(cluster);
              }}
            >
              <ClusterIcon clusterPosts={cluster} isUserLoc={isUserLoc} />
            </Marker>
          );
        })}

        {routeDestination && googleMapsApiKey ? (
          <MapDirections
            origin={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
            destination={routeDestination}
            apiKey={googleMapsApiKey}
            onReady={(meta) => {
              setRouteMeta(meta);
              mapRef.current?.fitToCoordinates(
                [
                  { latitude: userLocation.latitude, longitude: userLocation.longitude },
                  routeDestination,
                ],
                { edgePadding: { top: 120, right: 64, bottom: 220, left: 64 }, animated: true }
              );
            }}
          />
        ) : null}
      </MapView>

      <MapCarousel
        selectedCluster={selectedCluster!}
        userLocation={userLocation}
        onNavigateInApp={(coords) => {
          setRouteDestination(coords);
          setRouteMeta(null);
          setSelectedCluster(null);
        }}
      />
    </View>
  );
}
