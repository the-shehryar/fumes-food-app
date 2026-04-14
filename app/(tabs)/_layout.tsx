import { Tabs } from "expo-router";
import Octicons from "@expo/vector-icons/Octicons";
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCartStore } from "@/stores/cart.store";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import TabBar from "../components/TabBar";


export default function TabLayout() {

  let {items, getTotalItems} = useCartStore()
  let [cartNumber, setCartNumber] = useState(0)

  useEffect(()=>{
    let cartValue = items.length
    setCartNumber(cartValue)
  }, [items]) 

  return (
    
    <Tabs
      // screenOptions={{
      //   tabBarActiveTintColor: "#F97316",
      //   headerShown : false
      // }}
      tabBar={(props) => <TabBar {...props}/>}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          // tabBarIcon: ({ color, size, focused }) => {
          //   return focused ? (
          //     <Feather name="coffee" size={24} color={color} />
          //   ) : (
          //    <Feather name="coffee" size={24} color="#444" />
          //   );
          // },
        }}
      />
      <Tabs.Screen 
      name="search"
        options={{
          title: "Search",
          headerShown: false,
          // tabBarIcon: ({ color, size, focused }) => {
          //   return focused ? (
          //     <Feather name="search" size={24} color={color} />
          //   ) : (
          //     <Feather name="search" size={24} color="#444" />
          //   );
          // },
        }}
      />
      <Tabs.Screen 
      name="cart"
        options={{
          title: "Cart",
          headerShown: false,
          tabBarBadge : cartNumber,
          tabBarBadgeStyle : { display : cartNumber > 0 ? "flex" :"none", backgroundColor  : "#ff611d", fontSize : 8, width : 18, height : 18, borderRadius : 20},
          // tabBarIcon: ({ color, size, focused }) => {
          //   return focused ? (
          //      <Ionicons name={'cart-outline'} size={24} color= {color} />
          //      // <Feather name="shopping-cart" size={24} color={color} />
          //     ) : (
          //     <Ionicons name={'cart-outline'} size={24} color= {'#444'} />
          //     // <Feather name="shopping-cart" size={24} color="#444" />
          //   );
          // },
        }}
      />
      <Tabs.Screen 
      name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          // tabBarIcon: ({ color, size, focused }) => {
          //   return focused ? (
          //     <Ionicons name="person-outline" size={24} color={color} />
          //   ) : (
          //     <Ionicons name="person-outline" size={24} color={'#444'} />
          //   );
          // },
        }}
      />
    </Tabs>
  );
}
