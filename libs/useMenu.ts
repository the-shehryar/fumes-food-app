// import { Client, Databases, Query } from 'react-native-appwrite';

// // Initialize Appwrite
// const client = new Client()
//   .setEndpoint('YOUR_ENDPOINT') // Your Appwrite Endpoint
//   .setProject('YOUR_PROJECT_ID'); // Your project ID

// const databases = new Databases(client);

// const DATABASE_ID = 'YOUR_DATABASE_ID';
// const MENU_COLLECTION_ID = 'menu';
// const CUSTOMIZATION_COLLECTION_ID = 'customizations';
// const JUNCTION_COLLECTION_ID = 'menu_customizations';

// // ============================================
// // FUNCTION 1: Get all menu items with their customizations
// // ============================================
// export const getMenuWithCustomizations = async () => {
//   try {
//     // STEP 1: Fetch all menu items
//     const menuResponse = await databases.listRows(
//       DATABASE_ID,
//       MENU_COLLECTION_ID
//     );
    
//     const menuItems = menuResponse.documents;
    
//     // STEP 2: For each menu item, fetch its customizations
//     const menuWithCustomizations = await Promise.all(
//       menuItems.map(async (menuItem) => {
//         // Get junction records for this menu item
//         const junctionRecords = await databases.listDocuments(
//           DATABASE_ID,
//           JUNCTION_COLLECTION_ID,
//           [Query.equal('menu_id', menuItem.$id)] // Filter by menu_id
//         );
        
//         // STEP 3: For each junction record, fetch the actual customization
//         const customizations = await Promise.all(
//           junctionRecords.documents.map(async (junction) => {
//             const customization = await databases.getDocument(
//               DATABASE_ID,
//               CUSTOMIZATION_COLLECTION_ID,
//               junction.customization_id
//             );
            
//             // Return customization in your desired structure
//             return {
//               name: customization.name,
//               id: customization.$id,
//               price: customization.price,
//               icon: customization.icon
//             };
//           })
//         );
        
//         // Return menu item with its customizations array
//         return {
//           ...menuItem,
//           customizations: customizations // Array of customization objects
//         };
//       })
//     );
    
//     return menuWithCustomizations;
    
//   } catch (error) {
//     console.error('Error fetching menu:', error);
//     throw error;
//   }
// };

// // ============================================
// // FUNCTION 2: Add a customization to a menu item
// // ============================================
// const addCustomizationToMenu = async (menuId, customizationId) => {
//   try {
//     await databases.createDocument(
//       DATABASE_ID,
//       JUNCTION_COLLECTION_ID,
//       'unique()', // Auto-generate ID
//       {
//         menu_id: menuId,
//         customization_id: customizationId
//       }
//     );
    
//     console.log('Customization added to menu item');
//   } catch (error) {
//     console.error('Error adding customization:', error);
//   }
// };

// // ============================================
// // FUNCTION 3: Create new customization
// // ============================================
// const createCustomization = async (name, price, icon) => {
//   try {
//     const response = await databases.createDocument(
//       DATABASE_ID,
//       CUSTOMIZATION_COLLECTION_ID,
//       'unique()',
//       {
//         name: name,
//         price: price,
//         icon: icon
//       }
//     );
    
//     return response.$id; // Return the new customization ID
//   } catch (error) {
//     console.error('Error creating customization:', error);
//   }
// };

// // ============================================
// // FUNCTION 4: Create new menu item
// // ============================================
// const createMenuItem = async (name, price, customizationIds = []) => {
//   try {
//     // Create the menu item
//     const menuItem = await databases.createDocument(
//       DATABASE_ID,
//       MENU_COLLECTION_ID,
//       'unique()',
//       {
//         name: name,
//         price: price
//       }
//     );
    
//     // Link customizations to this menu item
//     for (const customizationId of customizationIds) {
//       await addCustomizationToMenu(menuItem.$id, customizationId);
//     }
    
//     return menuItem.$id;
//   } catch (error) {
//     console.error('Error creating menu item:', error);
//   }
// };