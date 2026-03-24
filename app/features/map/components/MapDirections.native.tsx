import React from 'react';
import MapViewDirections from 'react-native-maps-directions';

type LatLng = { latitude: number; longitude: number };

interface MapDirectionsProps {
  origin: LatLng;
  destination: LatLng;
  apiKey: string;
  onReady?: (result: { distance: number; duration: number }) => void;
}

export default function MapDirections({
  origin,
  destination,
  apiKey,
  onReady,
}: MapDirectionsProps) {
  if (!apiKey) return null;

  return (
    <MapViewDirections
      origin={origin}
      destination={destination}
      apikey={apiKey}
      strokeWidth={5}
      strokeColor="#16A34A"
      mode="DRIVING"
      optimizeWaypoints
      onReady={(result) => {
        onReady?.({ distance: result.distance, duration: result.duration });
      }}
      onError={(errorMessage) => {
        console.log('MapDirections error:', errorMessage);
      }}
    />
  );
}
