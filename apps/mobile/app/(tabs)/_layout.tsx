import { Tabs } from 'expo-router';
import React from 'react';

import { hero } from '@/constants/icons';

import { HapticTab } from '@/components/haptic-tab';
import { useThemePalette } from '@/hooks/use-theme-palette';

export default function TabLayout() {
    const theme = useThemePalette();

    return (
        <Tabs
            safeAreaInsets={{ bottom: 0 }}
            detachInactiveScreens={false}
            screenOptions={{
                tabBarActiveTintColor: theme.primaryLight,
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
                    position: 'absolute',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',

                    width: '90%',
                    marginLeft: '5%',
                    marginRight: '5%',
                    bottom: 20,
                    paddingTop: 0,
                    paddingBottom: 0,
                    height: 70,

                    elevation: 5, // shadow for Android
                    backgroundColor: theme.primarySoft,
                    borderRadius: 100,
                    shadowColor: theme.primarySoft, // iOS shadow
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    borderTopWidth: 0,
                },
                tabBarItemStyle: {
                    flex: 1,
                    paddingVertical: 0,
                },
                tabBarIconStyle: {
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 0,
                    marginBottom: 0,
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
                            <hero.trophySolid size={32} color={color} />
                        ) : (
                            <hero.trophyOutline size={32} color={color} />
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
