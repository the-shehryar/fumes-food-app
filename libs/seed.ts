import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { ID } from "react-native-appwrite";
import { appwriteConfig, DATABASE_ID, databases, storage } from "./appwrite";
import seedableData from "./data";

interface Category {
  name: string;
  description: string;
}

interface Customization {
  name: string;
  icon: string;
  price: number;
  type: "topping" | "side"; // extend as needed
}

// interface MenuItem {
//   name: string;
//   description: string;
//   image_url: string;
//   price: number;
//   rating: number;
//   calories: number;
//   protein: number;
//   category_name: string;
//   customizations: string[]; // list of customization names
// }

// interface MenuItem extends Models.Row {
//   name: string;
//   description: string;
//   price: number;
//   image_url: string;
//   rating: number;
//   calories: number;
//   protein: number;
//   category_name: string;
//   $id: any;
//   customizations?: string[];
//   $updatedAt: any;
//   $createdAt: any;
// }

interface SeedMenuItem {
  name: string;
  description: string;
  image_url: string;
  price: number;
  rating: number;
  calories: number;
  protein: number;
  category_name: string;
  customizations: string[]; 
  size: {
    name: string;
    price: number;
    calories: number;
    protein: number;
    isDefault: boolean;
  }[];
}

interface LocalMenusData {
  categories: Category[];
  customizations: Customization[];
  menu: SeedMenuItem[]; // ← use SeedMenuItem not MenuItem
}
// ensure local data has correct shape
const data = seedableData as unknown as LocalMenusData;
async function clearAll(tableId: string): Promise<void> {
  console.log("Clearing data");
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
  console.log("store cleared as well");
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

async function compressImage(imageUri: string) {
  const compression = await ImageManipulator.manipulate(imageUri)
    .resize({ width: 1024 })
    .renderAsync();

  const result = await compression.saveAsync({
    compress: 0.7,
    format: SaveFormat.JPEG,
  });

  return result.uri;
}

async function uploadImageToStorage(imageUrl: string) {
  // Compressed Image
  const compressedUri = await compressImage(imageUrl);
  // Fetching Compressed Image
  const response = await fetch(compressedUri);
  // Creating a blob to upload
  const blob = await response.blob();

  // Creating file name
  const fileName = imageUrl.split("/").pop() || `file-${Date.now()}.jpg`;

  //  file specific structure
  const file = {
    name: fileName,
    type: blob.type || "image/jpeg",
    size: blob.size,
    uri: compressedUri,
  };

  const uploaded = await storage.createFile({
    bucketId: appwriteConfig.bucketId,
    fileId: ID.unique(),
    file,
  });

  return storage.getFileViewURL(appwriteConfig.bucketId, uploaded.$id);
}

async function seed(): Promise<void> {
  // 1. Clear all
  await clearAll(appwriteConfig.menuItemSizesCollectionId);
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
        name: cat.name,
        description: cat.description,
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
        icon: cus.icon,
      },
    });
    console.log(doc.name);
    customizationMap[cus.name] = doc.$id;
  }

  // 4. Create Menu Items
  const menuMap: Record<string, string> = {};
  for (const item of data.menu) {
    const uploadedImage = await uploadImageToStorage(item.image_url);
    console.log(uploadedImage);
    const doc = await databases.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.menuCollectionId,
      rowId: ID.unique(),
      data: {
        name: item.name,
        description: item.description,
        image_url: uploadedImage,
        price: item.price,
        rating: item.rating,
        calories: item.calories,
        protein: item.protein,
        categories: categoryMap[item.category_name],
      },
    });
    console.log(doc.name);
    menuMap[item.name] = doc.$id;

    const sizeIds = await Promise.all(
      item.size.map(async (size) => {
        const createdSize = await databases.createRow({
          databaseId: DATABASE_ID,
          tableId: appwriteConfig.menuItemSizesCollectionId,
          rowId: ID.unique(),
          data: {
            name: size.name,
            price: size.price,
            calories: size.calories,
            protein: size.protein,
            isDefault: size.isDefault,
            menuItemId: doc.$id,
          },
        });
        return createdSize.$id;
      }),
    );

    // Step 3 — Update menu item with size relationship IDs
    await databases.updateRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.menuCollectionId,
      rowId: doc.$id,
      data: {
        sizes: sizeIds, 
      },
    });

    // 5. Create menu_customizations
    if (item.customizations)
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
