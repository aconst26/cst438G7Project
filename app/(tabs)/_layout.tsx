import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },  // hides the bottom tab bar
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Quiz',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Login"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },  // hides the bottom tab bar
        }}
      />
       <Tabs.Screen
        name="DailyTrivia"
        options={{
          title: 'Daily Trivia',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="0.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboards',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="0.circle.ar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          title: 'Logout',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="0.circle" color={color} />,
        }}
      />
    </Tabs>
    
  );
}
