import { Image } from 'expo-image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native';

export const useCarousel = (images: string[], width: number, autoPlay: boolean = true) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFetchingImage, setIsFetchingImage] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef = useRef(0);
  const hasInitialized = useRef(false);
  const hasPrefetched = useRef(false);
  const lastImageUrl = useRef<string | null>(null);

  const hasMultipleImages = images && images.length > 1;
  const safeImages = images || [];
  
  const displayImages = hasMultipleImages
    ? [safeImages[safeImages.length - 1], ...safeImages, safeImages[0]]
    : safeImages;
    
  const startIndex = hasMultipleImages ? 1 : 0;

  const stopAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    if (hasMultipleImages && width > 0 && autoPlay) {
      autoPlayTimerRef.current = setInterval(() => {
        scrollViewRef.current?.scrollTo({
          x: (indexRef.current + 1) * width,
          animated: true,
        });
      }, 5000);
    }
  }, [hasMultipleImages, width, stopAutoPlay, autoPlay]);

  // Prefetch all images
  useEffect(() => {
    if (safeImages.length > 0) {
      if (safeImages[0] !== lastImageUrl.current || !hasPrefetched.current) {
        setIsFetchingImage(true);
        lastImageUrl.current = safeImages[0];

        Promise.all(safeImages.map((url) => Image.prefetch(url)))
          .then(() => {
            hasPrefetched.current = true;
            setIsFetchingImage(false);
          })
          .catch(() => {
            hasPrefetched.current = true;
            setIsFetchingImage(false);
          });
      } else {
        setIsFetchingImage(false);
      }
    } else {
      setIsFetchingImage(false);
    }
  }, [safeImages]);

  useEffect(() => {
    if (hasMultipleImages && width > 0 && !hasInitialized.current) {
      scrollViewRef.current?.scrollTo({
        x: startIndex * width,
        animated: false,
      });
      setCurrentIndex(startIndex);
      indexRef.current = startIndex;
      hasInitialized.current = true;
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [width, hasMultipleImages, startAutoPlay, stopAutoPlay, startIndex]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const rawIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (width > 0 && rawIndex !== indexRef.current) {
      setCurrentIndex(rawIndex);
      indexRef.current = rawIndex;
    }
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    if (!hasMultipleImages || width === 0) return;
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    if (index === 0) {
      const last = displayImages.length - 2;
      scrollViewRef.current?.scrollTo({ x: last * width, animated: false });
      indexRef.current = last;
      setCurrentIndex(last);
    } else if (index === displayImages.length - 1) {
      scrollViewRef.current?.scrollTo({ x: width, animated: false });
      indexRef.current = 1;
      setCurrentIndex(1);
    }
    startAutoPlay();
  };

  const realCurrentIndex = hasMultipleImages
    ? currentIndex === 0
      ? safeImages.length - 1
      : currentIndex === displayImages.length - 1
        ? 0
        : currentIndex - 1
    : 0;

  return {
    scrollViewRef,
    displayImages,
    handleScroll,
    handleMomentumScrollEnd,
    stopAutoPlay,
    realCurrentIndex,
    hasMultipleImages,
    isFetchingImage,
  };
};
