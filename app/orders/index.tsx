import Colors from "@/constants/Colors";
import { appwriteConfig, databases } from "@/libs/appwrite";
import useAuthStore from "@/stores/auth.store";
import { Order } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Query } from "react-native-appwrite";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import OrderCard from "../components/OrderCard";

let { DARK, BORDER, WHITE, GRAY, GRAY_LIGHT } = Colors;

function Orders() {
  let { user } = useAuthStore();
  let insets = useSafeAreaInsets();
  let [userOrders, setUserOrders] = useState<Order[] | undefined>(undefined);
  let [loadingOrders, setLoadingOrders] = useState(false);

  async function getUserOrder(userId: string) {
    try {
      setLoadingOrders(true);
      let fetchedOrders = await databases.listRows({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.ordersCollectionId,
        queries: [Query.equal("userId", userId)],
      });
      setUserOrders(fetchedOrders.rows as unknown as Order[]);
      setLoadingOrders(false);
    } catch (error) {
      setLoadingOrders(false);
      console.log(error);
    }
  }

  useEffect(() => {
    if (user?.$id) getUserOrder(user.$id);
    console.log(userOrders?.length);
  }, []);
  return (
    <SafeAreaView edges={[]} style={{ flex: 1 }}>
      <StatusBar barStyle={"default"} />

      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.iconBtnLeft}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color={DARK} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Orders</Text>
        <TouchableOpacity style={styles.iconBtnRight}>
          <Ionicons name="create-outline" size={20} color={DARK} />
        </TouchableOpacity>
      </View>
      <View>
        <FlatList
          style={styles.flatlistStyles}
          data={userOrders}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <OrderCard order={item} key={item.$id} onCancel={() => {}} />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

export default Orders;

let styles = StyleSheet.create({
  flatlistStyles: {
    width: "100%",
  },
  flatlistContainerStyes: {},
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  iconBtnLeft: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: GRAY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnRight: {
    pointerEvents: "none",
    opacity: 0,
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: GRAY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  pageTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: DARK,
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "sans-serif-medium",
  },
});
