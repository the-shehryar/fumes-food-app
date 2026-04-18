import Colors from "@/constants/Colors";
import { appwriteConfig, databases } from "@/libs/appwrite";
import { getStoredData, storeData } from "@/libs/asyncStorage";
import useAppwrite from "@/libs/useAppwrite";
import useAuthStore from "@/stores/auth.store";
import useMiscStore from "@/stores/misc.store";
import { Order } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  SectionList,
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
import OrderCard from "../../components/OrderCard";
import { TileListSkeleton } from "../../components/skeletons";

let { DARK, BORDER, WHITE, GRAY, GRAY_LIGHT } = Colors;

function Orders() {
  // Component Native States
  let [loadingOrders, setLoadingOrders] = useState(false);
  let [userOrders, setUserOrders] = useState<Order[] | undefined>(undefined);
  let [refreshing, setRefeshing] = useState<boolean>(false);
  // Global States
  let { user } = useAuthStore();
  let insets = useSafeAreaInsets();
  let {
    savedOrders,
    setSavedOrders,
    isLocalizedOrders,
    setIsLocalizedOrders,
    setIsLocalizingOrders,
    isLocalizingOrders,
  } = useMiscStore();

  async function getUserOrder({ userId }: { userId: string }) {
    try {
      setLoadingOrders(true);
      let fetchedOrders = await databases.listRows({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.ordersCollectionId,
        queries: [Query.equal("userId", userId)],
      });
      setUserOrders(fetchedOrders.rows as unknown as Order[]);
      // First Fetch done and saved
      // Local first implementation
      try {
        setIsLocalizingOrders(true);
        await storeData(JSON.stringify(fetchedOrders.rows), "savedOrders");
        let savedData = await getStoredData("savedOrders");
        console.log("orders were saved successfully");
        setIsLocalizedOrders(true);
        // This is global state containing the saved order in string not parsed
        if (savedData) setSavedOrders(JSON.stringify(savedData));
        // console.log("saved data" +savedData);
      } catch (error) {
        setIsLocalizedOrders(false);
        console.log("failed to localize orders");
      } finally {
        setIsLocalizingOrders(false);
      }
      setLoadingOrders(false);
    } catch (error) {
      setLoadingOrders(false);
      console.log(error);
    }
  }

  async function onRefresh() {
    setRefeshing(true);
    await refetch({ userId: user?.$id });
    setRefeshing(false);
  }

  let {
    data,
    refetch,
    loading: ordersLoading,
  } = useAppwrite({
    fn: getUserOrder,
    params: {
      userId: user?.$id as string,
    },
    skip: isLocalizedOrders,
  });

  useEffect(() => {
    if (isLocalizingOrders) return;
    if (user?.$id) {
      if (isLocalizedOrders && savedOrders !== "[]") {
        // use local data
        try {
          let parsedOrders = JSON.parse(savedOrders);
          setUserOrders(parsedOrders);
          console.log("coming from local saved");
        } catch (error) {
          // parse failed, fall back to network
          console.log("parse failed, fetching from network");
          refetch({ userId: user.$id }).catch(console.log);
        }
      } else {
        // fetch from network
        refetch({ userId: user.$id }).catch(console.log);
      }
    }
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
      <View style={{ flex: 1 }}>
        {loadingOrders ? (
          <TileListSkeleton count={6} />
        ) : (
          <SectionList
            contentContainerStyle={styles.sectionlistContainerStyles}
            sections={[
              {
                title: "In Progress",
                data: userOrders?.filter((o) => o.status !== "delivered") ?? [],
              },
              {
                title: "Completed",
                data: userOrders?.filter((o) => o.status === "delivered") ?? [],
              },
            ]}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
              <OrderCard order={item} onCancel={() => {}} />
            )}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListEmptyComponent={<ActivityIndicator size={"large"} />}
            renderSectionHeader={({ section: { title, data } }) => (
              <View style={styles.firstSectionHeading}>
                <Text style={styles.headingText}>
                  {title} ({data.length})
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

export default Orders;

let styles = StyleSheet.create({
  firstSectionHeading: {
    paddingTop: 10,
    paddingBottom: 30,
  },
  headingText: {
    fontSize: 16,
    fontWeight: 800,
  },
  secondSectionHeading: {},
  flatlistStyles: {
    width: "100%",
  },
  sectionlistContainerStyles: {
    paddingHorizontal: 30,
    justifyContent: "center",
    width: "100%",
    paddingVertical: 20,
  },
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
