import React, { PropsWithChildren, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import { runOnJS } from 'react-native-reanimated';

const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 500;

type TabSwipeViewProps = PropsWithChildren<{
  routes: readonly string[];
}>;

export function TabSwipeView({ routes, children }: TabSwipeViewProps) {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const isTransitioningRef = useRef(false);

  const routeIndex = useMemo(
    () => routes.findIndex((name) => name === route.name),
    [route.name, routes]
  );

  const handleSwipe = (translationX: number, velocityX: number) => {
    if (routeIndex === -1) {
      return;
    }

    if (isTransitioningRef.current) {
      return;
    }

    const swipeLeft =
      translationX < -SWIPE_DISTANCE || velocityX < -SWIPE_VELOCITY;
    const swipeRight =
      translationX > SWIPE_DISTANCE || velocityX > SWIPE_VELOCITY;

    if (swipeLeft && routeIndex < routes.length - 1) {
      navigation.navigate(routes[routeIndex + 1]);
      return;
    }

    if (swipeRight && routeIndex > 0) {
      navigation.navigate(routes[routeIndex - 1]);
    }
  };

  const gesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .failOffsetY([-15, 15])
    .onEnd((event) => {
      runOnJS(handleSwipe)(event.translationX, event.velocityX);
    });

  useEffect(() => {
    const start = navigation.addListener('transitionStart', () => {
      isTransitioningRef.current = true;
    });
    const end = navigation.addListener('transitionEnd', () => {
      isTransitioningRef.current = false;
    });

    return () => {
      start();
      end();
    };
  }, [navigation]);

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.container}>{children}</View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
