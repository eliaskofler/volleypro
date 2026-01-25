import { Tabs } from 'expo-router';
import React from 'react';

import { hero } from '@/constants/icons';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const themeColors = Colors[colorScheme ?? 'light'];

    return (
        <Tabs
            detachInactiveScreens={false}
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tabIconSelected,
                animation: 'shift',
                transitionSpec: {
                    animation: 'timing',
                    config: { duration: 100 },
                },
                headerShown: false,
                lazy: false,
                tabBarButton: HapticTab,
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'fixed',
                    width: '90%',
                    alignSelf: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    bottom: 20,
                    elevation: 5, // shadow for Android
                    backgroundColor: themeColors.background,
                    borderRadius: 100,
                    height: 70,
                    shadowColor: '#000', // iOS shadow
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    borderTopWidth: 0,
                },
            }}>
            <Tabs.Screen
                name={"maps"}
                options={{
                    title: 'Maps',
                    tabBarIcon: ({ color, focused }) =>
                        focused ? (
                            <hero.mapPinSolid size={32} color={color} />
                        ) : (
                            <hero.mapPinOutline size={32} color={color} />
                        ),
                }}
            />
            <Tabs.Screen
                name={"index"}
                options={{
                    title: 'Tutorials',
                    tabBarIcon: ({ color, focused }) =>
                        focused ? (
                            <hero.bookOpenSolid size={32} color={color} />
                        ) : (
                            <hero.bookOpenOutline size={32} color={color} />
                        ),
                }}
            />
            <Tabs.Screen
                name={"exercises"}
                options={{
                    title: 'Exercises',
                    tabBarIcon: ({ color, focused }) =>
                        focused ? (
                            <hero.homeOutline size={32} color={color} />
                        ) : (
                            <hero.homeOutline size={32} color={color} />
                        ),
                }}
            />
            <Tabs.Screen
                name={"events"}
                options={{
                    title: 'Events',
                    tabBarIcon: ({ color, focused }) =>
                        focused ? (
                            <hero.calendarSolid size={32} color={color} />
                        ) : (
                            <hero.calendarOutline size={32} color={color} />
                        ),
                }}
            />
        </Tabs>
    )
};
