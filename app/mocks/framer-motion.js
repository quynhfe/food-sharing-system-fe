import React, { createContext } from 'react';

// Mock framer-motion for React Native
// Moti uses these for presence/exit animations but they are not needed/available in RN builds
// where moti relies on react-native-reanimated

export const AnimatePresence = ({ children }) => children;

export const PresenceContext = createContext(null);

export const usePresence = () => [true, null];

export const useIsPresent = () => true;

export default {
  AnimatePresence,
  PresenceContext,
  usePresence,
  useIsPresent,
};
