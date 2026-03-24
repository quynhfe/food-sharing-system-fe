import React from 'react';
import { View, Text } from 'react-native';

const MapView = (props: any) => (
  <View style={[{ backgroundColor: '#F8FAF8', justifyContent: 'center', alignItems: 'center' }, props.style]}>
    <View className="items-center px-6">
      <Text className="text-xl font-bold text-slate-800 text-center mb-2">Bản đồ chưa khả dụng trên Web</Text>
      <Text className="text-slate-500 text-center">Chúng tôi đang phát triển tính năng này cho nền tảng web. Vui lòng sử dụng ứng dụng di động để trải nghiệm tốt nhất.</Text>
    </View>
  </View>
);

const Marker = ({ children }: any) => <>{children}</>;
const Polyline = () => null;
const Circle = () => null;

export { MapView as default, Marker, Polyline, Circle };
