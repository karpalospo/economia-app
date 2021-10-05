
import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

export const useAnimate = (inverted = false, listeningTo = [], avoidFirst = true) => {
  const scale = useRef(new Animated.Value(0)).current;

  const animate = () => {
    Animated.timing(scale, { toValue: inverted ? 1 : 0, duration: 200, useNativeDriver: true }).start();
  };

  const interpolate = range => scale.interpolate({ inputRange: [0, 1], outputRange: range });

  const [isFirst, setIsFirst] = useState(true);

  useEffect(() => {
    (!avoidFirst || !isFirst) && animate();
    setIsFirst(false);
  }, listeningTo);

  return interpolate;
};