import { Tabs } from "expo-router";
import Octicons from "@expo/vector-icons/Octicons";
import Feather from '@expo/vector-icons/Feather';
import { useCartStore } from "@/stores/cart.store";
import { useEffect, useState } from "react";


export default function TabLayout() {

  let {items, getTotalItems} = useCartStore()
  let [cartNumber, setCartNumber] = useState(0)

  useEffect(()=>{
    let cartValue = getTotalItems()
    setCartNumber(cartValue)
  }, [items]) 

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#050505",
        headerShown : false
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
          // headerShown: true,
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
          headerShown: false,
          tabBarBadge : cartNumber,
          tabBarBadgeStyle : {backgroundColor  : "#ff611d", fontSize : 8, width : 18, height : 18, borderRadius : 20},
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
