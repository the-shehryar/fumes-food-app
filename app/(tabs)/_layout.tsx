import { Tabs } from "expo-router";
import Octicons from "@expo/vector-icons/Octicons";
import Feather from '@expo/vector-icons/Feather';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#050505",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            return focused ? (
              <Octicons name="home" size={24} color={color} />
            ) : (
              <Octicons name="home" size={24} color="#444" />
            );
          },
        }}
      />
      <Tabs.Screen 
      name="search"
        options={{
          title: "Search",
          headerShown: true,
          tabBarIcon: ({ color, size, focused }) => {
            return focused ? (
              <Octicons name="search" size={24} color={color} />
            ) : (
              <Octicons name="search" size={24} color="#444" />
            );
          },
        }}
      />
      <Tabs.Screen 
      name="cart"
        options={{
          title: "Cart",
          headerShown: true,
          tabBarIcon: ({ color, size, focused }) => {
            return focused ? (
              <Feather name="shopping-cart" size={24} color={color} />
            ) : (
              <Feather name="shopping-cart" size={24} color="#444" />
            );
          },
        }}
      />
      <Tabs.Screen 
      name="profile"
        options={{
          title: "Profile",
          headerShown: true,
          tabBarIcon: ({ color, size, focused }) => {
            return focused ? (
              <Octicons name="person" size={24} color={color} />
            ) : (
              <Octicons name="person" size={24} color="#444" />
            );
          },
        }}
      />
    </Tabs>
  );
}
