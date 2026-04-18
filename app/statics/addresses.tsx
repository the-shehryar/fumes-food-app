import Colors from "@/constants/Colors";
import { fetchUserAddress } from "@/libs/helpers";
import useAuthStore from "@/stores/auth.store";
import usePreferencesStore from "@/stores/preferences.store";
import { AddressAppwrite, User } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AddressCard from "../../components/AddressCard";
import AddressModal from "../../components/AddressModal";

let { DARK, GRAY_LIGHT, BORDER, WHITE, ORANGE, ORANGE_LIGHT } = Colors;

export default function Addresses() {
  let insets = useSafeAreaInsets();
  let [isFetchingAddress, setIsFetchingAddress] = useState<boolean>(false);
  let { userAddresses, setUserAddresses } = usePreferencesStore();
  let [addressModal, setAddressModal] = useState<boolean>(false);
  let [selectedAddress, setSelectedAddress] = useState<
    AddressAppwrite | undefined
  >(undefined);
  let { user } = useAuthStore();

  async function renderAddresses(user: User) {
    let address = await fetchUserAddress(user?.$id).catch((err) =>
      console.log(err),
    );
    if (address) {
      setUserAddresses(address as unknown as AddressAppwrite[]);
      setIsFetchingAddress(false);
    }
  }

  async function handleRemove(item: AddressAppwrite) {
    console.log(item.$id);
  }

  useEffect(() => {
    console.log(userAddresses);
    if (user) {
      setIsFetchingAddress(true);
      renderAddresses(user);
    }
  }, [isFetchingAddress]);

  return (
    <SafeAreaView edges={[]} style={{ flex: 1 }}>
      <AddressModal
        visible={addressModal}
        onClose={() => setAddressModal(false)}
        action="update"
        onUpdate={(address) => {
          (() => {
            // Update the mentioned address
            console.log(address);
          })();
        }}
        target={selectedAddress}
        onSave={(newAddress) => {
          //   creatNewAddress(newAddress);
        }}
      />
      <StatusBar barStyle={"default"} />
      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.iconBtnLeft}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color={DARK} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Saved Addresses</Text>
        <TouchableOpacity style={styles.iconBtnRight}>
          <Ionicons name="create-outline" size={20} color={DARK} />
        </TouchableOpacity>
      </View>
      <View style={styles.addressPageWraper}>
        {/* Address Card */}
        <TouchableOpacity
          onPress={() => {
            setAddressModal(!addressModal);
          }}
          style={styles.addMoreBtn}
        >
          <Ionicons
            name="add-circle-outline"
            size={20}
            color={ORANGE}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.addMoreText}>Add address</Text>
        </TouchableOpacity>

        <Text style={styles.flatlistTextStyles}>Address list</Text>
        <FlatList
          style={{ width: "100%" }}
          contentContainerStyle={styles.flatlistStyles}
          data={userAddresses}
          renderItem={({ item, index }) => (
            <AddressCard
              address={item}
              index={index as any}
              onRemove={() => handleRemove(item)}
              onEdit={() => {
                setAddressModal(true);
                setSelectedAddress(item);
              }}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addressPageWraper: {
    flex: 1,
    width: "100%",
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  flatlistStyles: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  flatlistTextStyles: {
    width: "90%",
    // paddingHorizontal : '10%',
    justifyContent: "center",
    alignItems: "center",
    fontSize: 16,
    marginVertical: 20,
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "sans-serif-medium",
    fontWeight: 800,
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
  addMoreBtn: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: ORANGE,
    borderStyle: "dashed",
    borderRadius: 14,
    marginVertical: 20,
    paddingVertical: 13,
  },
  addMoreText: { fontSize: 14, fontWeight: "700", color: ORANGE },
});
