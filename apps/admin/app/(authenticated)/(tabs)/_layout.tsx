import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarInactiveBackgroundColor: '#FFFFFF',
        tabBarActiveBackgroundColor: '#FFFFFF',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          paddingTop: 12,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'home',
          tabBarIcon: ({ focused }) => (
            <Ionicons size={28} name="home" color={focused ? '#3B82F6' : '#6B7280'} />
          ),
        }}
      />
      <Tabs.Screen
        name="check-in"
        options={{
          title: 'check-in',
          tabBarIcon: ({ focused }) => (
            <Ionicons size={28} name="checkbox-outline" color={focused ? '#3B82F6' : '#6B7280'} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'schedule',
          tabBarIcon: ({ focused }) => (
            <Ionicons size={28} name="calendar" color={focused ? '#3B82F6' : '#6B7280'} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'chat',
          tabBarIcon: ({ focused }) => (
            <Ionicons size={28} name="chatbubble" color={focused ? '#3B82F6' : '#6B7280'} />
          ),
        }}
      />
    </Tabs>
  );
}
