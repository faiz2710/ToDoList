import { Tabs } from "expo-router";
import React from "react";
import { View, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          position: "absolute",
          left: 20,
          right: 20,
          height: 70,
          borderRadius: 20,
          backgroundColor: "#fff",
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          borderTopWidth: 0,
          paddingBottom: 12,
        },

        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },

        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#9ca3af",

        tabBarItemStyle: {
          marginVertical: 10, // Mengurangi margin agar tidak memotong icon
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#eef2ff" : "transparent",
                padding: 6,
                borderRadius: 10,
              }}
            >
              <Ionicons
                name={focused ? "checkmark-done" : "checkmark-done-outline"}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Focus",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#eef2ff" : "transparent",
                padding: 6,
                borderRadius: 10,
              }}
            >
              <Ionicons
                name={focused ? "timer" : "timer-outline"}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="archive"
        options={{
          title: "Archive",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#eef2ff" : "transparent",
                padding: 6,
                borderRadius: 10,
              }}
            >
              <Ionicons
                name={focused ? "archive" : "archive-outline"}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#eef2ff" : "transparent",
                padding: 6,
                borderRadius: 10,
              }}
            >
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}