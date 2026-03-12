// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity } from 'react-native';
// import { getMenuWithCustomizations } from './useMenu';

// const MenuScreen = () => {
//   const [menuItems, setMenuItems] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   useEffect(() => {
//     loadMenu();
//   }, []);
  
//   const loadMenu = async () => {
//     try {
//       const data = await getMenuWithCustomizations();
//       setMenuItems(data);
//     } catch (error) {
//       console.error('Failed to load menu:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const renderCustomization = ({ item }) => (
//     <View style={{ flexDirection: 'row', padding: 10, backgroundColor: '#f0f0f0', margin: 5, borderRadius: 5 }}>
//       <Text style={{ fontSize: 20 }}>{item.icon}</Text>
//       <Text style={{ marginLeft: 10 }}>{item.name}</Text>
//       <Text style={{ marginLeft: 'auto' }}>+${item.price}</Text>
//     </View>
//   );
  
//   const renderMenuItem = ({ item }) => (
//     <View style={{ padding: 15, backgroundColor: 'white', marginBottom: 10, borderRadius: 8 }}>
//       <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
//       <Text style={{ fontSize: 16, color: 'green' }}>${item.price}</Text>
      
//       {/* Show customizations for this menu item */}
//       {item.customizations && item.customizations.length > 0 && (
//         <View style={{ marginTop: 10 }}>
//           <Text style={{ fontWeight: 'bold' }}>Available Customizations:</Text>
//           <FlatList
//             data={item.customizations}
//             renderItem={renderCustomization}
//             keyExtractor={(custom) => custom.id}
//           />
//         </View>
//       )}
//     </View>
//   );
  
//   if (loading) {
//     return <Text>Loading menu...</Text>;
//   }
  
//   return (
//     <View style={{ flex: 1, padding: 10 }}>
//       <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Menu</Text>
//       <FlatList
//         data={menuItems}
//         renderItem={renderMenuItem}
//         keyExtractor={(item) => item.$id}
//       />
//     </View>
//   );
// };

// export default MenuScreen;