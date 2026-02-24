import { ID } from "react-native-appwrite";
import { appwriteConfig, databases, storage } from "./appwrite";
import seedableData from "./data";

interface Category {
  name: string;
  description: string;
}

interface Customization {
  name: string;
  price: number;
  type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
  name: string;
  description: string;
  image_url: string;
  price: number;
  rating: number;
  calories: number;
  protein: number;
  category_name: string;
  customizations: string[]; // list of customization names
}

interface LocalMenusData {
  categories: Category[];
  customizations: Customization[];
  menu: MenuItem[];
}

// ensure local data has correct shape
const data = seedableData as LocalMenusData;

async function clearAll(tableId: string): Promise<void> {
    console.log('Clearing data')
  const list = await databases.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId,
  });

  await Promise.all(
    list.rows.map((doc) =>
      databases.deleteRow({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: doc.$id,
      }),
    ),
  );
}

async function clearStorage(): Promise<void> {
    console.log('store cleared as well')
  const list = await storage.listFiles({
    bucketId: appwriteConfig.bucketId,
  });

  await Promise.all(
    list.files.map((file) =>
      storage.deleteFile({
        bucketId: appwriteConfig.bucketId,
        fileId: file.$id,
      }),
    ),
  );
}

//? Upload image to Storage 

async function uploadImageToStorage(imageUrl: string) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();

  const fileObj = {
    name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
    type: blob.type,
    size: blob.size,
    uri: imageUrl,
  };

  const file = await storage.createFile({
    bucketId: appwriteConfig.bucketId,
    fileId: ID.unique(),
    file : fileObj,
  });

  return storage.getFileViewURL(appwriteConfig.bucketId, file.$id);
}




// async function uploadImageToStorage2(imageUrl: string) {
//     const destination = new Directory(Paths.document, 'imagesUrl2')
//     if (!destination.exists){
//         console.log('en el if');
//         destination.create()
//     } else {
//         console.log('en el else');
//         console.log('destination',destination);
//     }
//     const blob = await File.downloadFileAsync(imageUrl, destination)
//     destination.delete()
//     console.log('blob', blob)
//     console.log('blob.uri', blob.uri)
    
//     const fileObj = {
//         name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
//         type: blob.type,
//         size: blob.size,
//         uri: imageUrl,
//     };

//     const file = await storage.createFile(
//         appwriteConfig.bucketId,
//         ID.unique(),
//         fileObj
//     );

//     return storage.getFileViewURL(appwriteConfig.bucketId, file.$id);
// } 







async function seed(): Promise<void> {
  // 1. Clear all
  await clearAll(appwriteConfig.categoriesCollectionId);
  await clearAll(appwriteConfig.customizationsCollectionId);
  await clearAll(appwriteConfig.menuCollectionId);
  await clearAll(appwriteConfig.menuCustomizationsCollectionId);
  await clearStorage();

  // 2. Create Categories
  const categoryMap: Record<string, string> = {};
  for (const cat of data.categories) {
    const doc = await databases.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.categoriesCollectionId,
      rowId: ID.unique(),
      data: { 
        name : cat.name,
        description : cat.description
       },
    });
    categoryMap[cat.name] = doc.$id;
  }

//   3. Create Customizations
  const customizationMap: Record<string, string> = {};
  for (const cus of data.customizations) {
    const doc = await databases.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.customizationsCollectionId,
      rowId: ID.unique(),
      data: {
        name: cus.name,
        price: cus.price,
        type: cus.type,
      },
    });
    console.log(doc.name)
    customizationMap[cus.name] = doc.$id;
  }

  // 4. Create Menu Items
  const menuMap: Record<string, string> = {};
  for (const item of data.menu) {
    // const uploadedImage = await uploadImageToStorage(item.image_url);
    // console.log(uploadedImage)
    const doc = await databases.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.menuCollectionId,
      rowId: ID.unique(),
      data: {
        name: item.name,
        description: item.description,
        // image_url: uploadedImage,
        price: item.price,
        rating: item.rating,
        calories: item.calories,
        protein: item.protein,
        categories: categoryMap[item.category_name],
      },
    });
    console.log(doc.name)
    menuMap[item.name] = doc.$id;

    // 5. Create menu_customizations
    for (const cusName of item.customizations) {
      await databases.createRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.menuCustomizationsCollectionId,
        rowId: ID.unique(),
        data: {
          menu: doc.$id,
          customizations: customizationMap[cusName],
        },
      });
    }
  }

  console.log("✅ Seeding complete.");
}

export default seed;
