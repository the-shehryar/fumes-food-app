import { appwriteConfig, DATABASE_ID, databases } from "@/libs/appwrite";
import useAuthStore from "@/stores/auth.store";
import { useCartStore } from "@/stores/cart.store";
import usePreferencesStore from "@/stores/preferences.store";
import { Address, AddressAppwrite } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { ID, Query } from "react-native-appwrite";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NewAddressModal from "../components/NewAddressModal";

import AppleIcon from "@/assets/images/apple-icon.svg";
import Card from "@/assets/images/card.svg";
import GoogleIcon from "@/assets/images/google-icon.svg";
import Cash from "@/assets/images/pakistan-rupee-note-color-icon.svg";
import { router } from "expo-router";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const ORANGE = "#F97316";
const ORANGE_LIGHT = "#FFF4EE";
const DARK = "#1A1A1A";
const GRAY = "#9CA3AF";
const GRAY_LIGHT = "#F5F5F5";
const WHITE = "#FFFFFF";
const BORDER = "#F0F0F0";
const GREEN = "#16A34A";
const GREEN_LIGHT = "#F0FDF4";

// ─── Data ─────────────────────────────────────────────────────────────────────
const ADDRESSES = [
  {
    id: "1",
    tag: "Home",
    icon: "home",
    address: "14-B, Street 5, G-11/1",
    city: "Islamabad, Pakistan",
  },
  {
    id: "2",
    tag: "Work",
    icon: "briefcase",
    address: "3rd Floor, Blue Area, F-7 Markaz",
    city: "Islamabad, Pakistan",
  },
  {
    id: "3",
    tag: "Other",
    icon: "location",
    address: "Plot 22, Sector E-11/4",
    city: "Islamabad, Pakistan",
  },
];

const PAYMENT_METHODS = [
  {
    id: "cod",
    label: "Cash on Delivery",
    sublabel: "Pay when you receive",
    icon: <Cash width={20} height={20} />,
    available: true,
  },
  {
    id: "stripe",
    label: "Credit / Debit Card",
    sublabel: "Visa, Mastercard, Amex",
    icon: <Card width={20} height={20} />,
    available: true,
  },
  {
    id: "googlepay",
    label: "Google Pay",
    sublabel: "Fast & secure",
    icon: <GoogleIcon width={20} height={20} />,
    available: true,
  },
  {
    id: "applepay",
    label: "Apple Pay",
    sublabel: Platform.OS === "ios" ? "Touch / Face ID" : "Touch / Face ID",
    icon: <AppleIcon width={20} height={20} />,
    available: Platform.OS === "ios",
    // available : true
  },
];

// ─── Animated Section ─────────────────────────────────────────────────────────
const FadeIn: React.FC<{ delay?: number; children: React.ReactNode }> = ({
  delay = 0,
  children,
}) => {
  const anim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(anim, {
        toValue: 1,
        duration: 380,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 380,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
};

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader: React.FC<{
  title: string;
  action?: string;
  onAction?: () => void;
}> = ({ title, action, onAction }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {action && (
      <TouchableOpacity onPress={onAction}>
        <Text style={styles.sectionAction}>{action}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addressModal, setAddressModal] = useState(false);
  const [fetchingAddress, setFetchingAddresses] = useState<boolean>(false);

  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [couponApplied, setCouponApplied] = useState(false);
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);

  let { userAddresses, setUserAddresses } = usePreferencesStore();
  let { user, isAuthenticated } = useAuthStore();
  let {
    items: itemsInCart,
    deliveryCharges,
    isCouponApplied,
    getTotalItems,
    clearCart,
    coupon,
    getTotalPrice,
  } = useCartStore();

  const subtotal = itemsInCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = isCouponApplied ? (coupon ? coupon.discount : 0) : 0;

  let total = getTotalPrice() + deliveryCharges - discount;
  if (getTotalItems() === 0) {
    total = 0;
  }

  const summaryAnim = useRef(new Animated.Value(0)).current;

  const toggleSummary = () => {
    Animated.timing(summaryAnim, {
      toValue: orderSummaryOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setOrderSummaryOpen(!orderSummaryOpen);
  };

  async function creatNewAddress(address: Address) {
    // Also add address creation limit - like one user can only have 5 addresses at max
    let uniqueId = ID.unique();
    try {
      let addressTable = await databases.createRow({
        databaseId: DATABASE_ID,
        tableId: "addresses",
        rowId: uniqueId,
        data: address,
      });

      if (addressTable) {
        ToastAndroid.show("Address Added Successfully", ToastAndroid.LONG);
        let alteredAddress = {
          ...address,
          $id: uniqueId,
          $createdAt: Date.now().toLocaleString(),
          $updatedAt: Date.now().toLocaleString(),
        };
        setUserAddresses(alteredAddress as unknown as AddressAppwrite);
        //? Add subscription event to reRender but for now add a state
      }
    } catch (error) {
      if (error instanceof Error)
        ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  }
  function handleNewAddress() {
    setAddressModal(true);
  }
  async function fetchUserAddress(targetUser: string) {
    try {
      let savedAddresses = await databases.listRows({
        databaseId: DATABASE_ID,
        tableId: "addresses",
        queries: [
          Query.equal("userId", targetUser),
          Query.orderDesc("$createdAt"),
        ],
      });
      savedAddresses.rows.map((item) => {
        setUserAddresses(item as unknown as AddressAppwrite);
      });
      setFetchingAddresses(false);
      return savedAddresses.rows;
    } catch (error) {
      if (error instanceof Error)
        ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  }
  async function handleOrderPlacement() {
    // Validate address, payment method selection, payment status
    let itemsInCartStringified = JSON.stringify(itemsInCart);
    try {
      setIsPlacingOrder(true);
      let userAddress = userAddresses.find(
        (address) => address.$id === selectedAddress,
      );
      console.log("Selected Address:", userAddress);
      // Validate user selected the address
      if (userAddress) {
        // craft an order object and save to appwrite
        let order = await databases.createRow({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.ordersCollectionId,
          rowId: ID.unique(),
          data: {
            userId: user?.$id,
            totalPrice: total,
            discount: discount,
            items: itemsInCartStringified,
            status: "pending",
            address: `${userAddress.address}, ${userAddress.city}`,
          },
        });

        if (order) {
          setIsPlacingOrder(false);
          clearCart();
          redirectHome();
          ToastAndroid.show("Order placed successfully!", ToastAndroid.LONG);
        } else {
          setIsPlacingOrder(false);
          ToastAndroid.show(
            "Failed to place order. Please try again.",
            ToastAndroid.LONG,
          );
        }
      }
    } catch (error) {
      setIsPlacingOrder(false);
      console.log(error instanceof Error ? error.message : error);
      error instanceof Error &&
        ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  }
  function redirectHome() {
    if(isAuthenticated){
      router.replace('/')
    }else {
      router.replace('/login')
    }
  }
  useEffect(() => {
    if (userAddresses !== undefined && userAddresses.length > 0) {
      setSelectedAddress(userAddresses[0].$id);
    } else {
      // Fetch Address,
      fetchUserAddress(user?.$id);
      setFetchingAddresses(true);
    }
  }, [userAddresses, total, itemsInCart]);

  return (
    <View style={styles.root}>
      {/* New Address Modal*/}
      <NewAddressModal
        visible={addressModal}
        onClose={() => setAddressModal(false)}
        onSave={(newAddress) => {
          creatNewAddress(newAddress);
        }}
      />

      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={22} color={DARK} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Checkout</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 120 },
        ]}
      >
        {/* ── Order Summary Toggle ── */}
        <FadeIn delay={80}>
          <View style={styles.px}>
            <TouchableOpacity
              style={styles.orderSummaryToggle}
              onPress={toggleSummary}
              activeOpacity={0.8}
            >
              <View style={styles.orderSummaryLeft}>
                <View style={styles.orderBubble}>
                  <Text style={styles.orderBubbleText}>
                    {/* How many items in total */}
                    {itemsInCart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Text>
                </View>
                <Text style={styles.orderSummaryLabel}>Order Summary</Text>
              </View>
              <View style={styles.orderSummaryRight}>
                <Text style={styles.orderSummaryPrice}>
                  ${total.toFixed(2)}
                </Text>
                <Animated.View
                  style={{
                    transform: [
                      {
                        rotate: summaryAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0deg", "180deg"],
                        }),
                      },
                    ],
                  }}
                >
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    color={GRAY}
                    style={{ marginLeft: 6 }}
                  />
                </Animated.View>
              </View>
            </TouchableOpacity>

            {/* Expanded order items */}
            <Animated.View
              style={{
                maxHeight: summaryAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 400],
                }),
                overflow: "hidden",
              }}
            >
              <View style={styles.orderItemsContainer}>
                {itemsInCart.map((item, idx) => (
                  <View key={item.id}>
                    <View style={styles.orderItem}>
                      <Image
                        source={{ uri: item.image_url }}
                        style={styles.orderItemImg}
                      />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.orderItemName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text style={styles.orderItemRest} numberOfLines={1}>
                          {/* {item.restaurant} */}
                        </Text>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <Text style={styles.orderItemPrice}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </Text>
                        <Text style={styles.orderItemQty}>
                          x{item.quantity}
                        </Text>
                      </View>
                    </View>
                    {idx < itemsInCart.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </View>
                ))}
              </View>
            </Animated.View>
          </View>
        </FadeIn>

        {/* ── Delivery Address ── */}
        <FadeIn delay={180}>
          <View style={styles.px}>
            <SectionHeader title="Delivery Address" />
            <View style={styles.card}>
              {userAddresses.length > 0
                ? userAddresses.map((addr, idx) => (
                    <View key={idx}>
                      <TouchableOpacity
                        style={styles.addressRow}
                        activeOpacity={0.75}
                        onPress={() => setSelectedAddress(addr.$id)}
                      >
                        <View
                          style={[
                            styles.addressIconWrap,
                            selectedAddress === addr.$id && {
                              backgroundColor: ORANGE_LIGHT,
                            },
                          ]}
                        >
                          <Ionicons
                            name={addr.icon as any}
                            size={18}
                            color={selectedAddress === addr.$id ? ORANGE : GRAY}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <View style={styles.addressTagRow}>
                            <Text style={styles.addressTag}>{addr.tag}</Text>
                            {selectedAddress === addr.$id && (
                              <View style={styles.defaultBadge}>
                                <Text style={styles.defaultBadgeText}>
                                  Delivering here
                                </Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.addressLine}>{addr.address}</Text>
                          <Text style={styles.addressCity}>{addr.city}</Text>
                        </View>
                        <View
                          style={[
                            styles.radioOuter,
                            selectedAddress === addr.$id && {
                              borderColor: ORANGE,
                            },
                          ]}
                        >
                          {selectedAddress === addr.$id && (
                            <View style={styles.radioInner} />
                          )}
                        </View>
                      </TouchableOpacity>
                      {idx < ADDRESSES.length - 1 && (
                        <View style={styles.divider} />
                      )}
                    </View>
                  ))
                : ""}

              <TouchableOpacity
                onPress={handleNewAddress}
                style={styles.addNewAddress}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color={ORANGE}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.addAddressText}>Add New Address</Text>
              </TouchableOpacity>
            </View>
          </View>
        </FadeIn>

        {/* ── Payment Method ── */}
        <FadeIn delay={280}>
          <View style={styles.px}>
            <SectionHeader title="Payment Method" />
            <View style={styles.card}>
              {PAYMENT_METHODS.map((paymentMethod, idx) => (
                <View key={paymentMethod.id}>
                  <TouchableOpacity
                    style={[
                      styles.paymentRow,
                      !paymentMethod.available && { opacity: 0.4 },
                    ]}
                    activeOpacity={paymentMethod.available ? 0.75 : 1}
                    onPress={() =>
                      paymentMethod.available &&
                      setSelectedPayment(paymentMethod.id)
                    }
                  >
                    <View
                      style={[
                        styles.paymentIconWrap,
                        selectedPayment === paymentMethod.id &&
                          paymentMethod.available && {
                            backgroundColor: ORANGE_LIGHT,
                          },
                      ]}
                    >
                      <Text style={styles.paymentEmoji}>
                        {paymentMethod.icon}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.paymentLabel}>
                        {paymentMethod.label}
                      </Text>
                      <Text style={styles.paymentSublabel}>
                        {paymentMethod.sublabel}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.radioOuter,
                        selectedPayment === paymentMethod.id &&
                          paymentMethod.available && { borderColor: ORANGE },
                      ]}
                    >
                      {selectedPayment === paymentMethod.id &&
                        paymentMethod.available && (
                          <View style={styles.radioInner} />
                        )}
                    </View>
                  </TouchableOpacity>
                  {idx < PAYMENT_METHODS.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))}
            </View>

            {/* Card fields shown when safepay / stripe selected */}
            {selectedPayment === "stripe" && (
              <Animated.View style={styles.stripeCard}>
                <Text style={styles.stripeCardTitle}>Card Details</Text>
                <View style={styles.inputWrap}>
                  <Ionicons
                    name="card-outline"
                    size={18}
                    color={GRAY}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Card number"
                    placeholderTextColor={GRAY}
                    style={styles.input}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputRow}>
                  <View style={[styles.inputWrap, { flex: 1, marginRight: 8 }]}>
                    <TextInput
                      placeholder="MM / YY"
                      placeholderTextColor={GRAY}
                      style={styles.input}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={[styles.inputWrap, { flex: 1 }]}>
                    <TextInput
                      placeholder="CVV"
                      placeholderTextColor={GRAY}
                      style={styles.input}
                      keyboardType="numeric"
                      secureTextEntry
                    />
                  </View>
                </View>
                <View style={styles.inputWrap}>
                  <TextInput
                    placeholder="Name on card"
                    placeholderTextColor={GRAY}
                    style={styles.input}
                  />
                </View>
              </Animated.View>
            )}
          </View>
        </FadeIn>

        {/* ── Coupon ── */}
        {/* <FadeIn delay={360}>
          <View style={styles.px}>
            <SectionHeader title="Promo Code" />
            <View style={styles.couponRow}>
              <View style={styles.couponInputWrap}>
                <Ionicons
                  name="pricetag-outline"
                  size={16}
                  color={couponApplied ? GREEN : GRAY}
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  value={coupon}
                  onChangeText={(t) => {
                    setCoupon(t);
                    if (couponApplied) setCouponApplied(false);
                  }}
                  placeholder="Enter promo code"
                  placeholderTextColor={GRAY}
                  style={styles.couponInput}
                  autoCapitalize="characters"
                />
              </View>
              <TouchableOpacity
                style={[
                  styles.couponBtn,
                  couponApplied && { backgroundColor: GREEN_LIGHT },
                ]}
                onPress={() =>
                  coupon.length > 0 && setCouponApplied(!couponApplied)
                }
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.couponBtnText,
                    couponApplied && { color: GREEN },
                  ]}
                >
                  {couponApplied ? "✓ Applied" : "Apply"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </FadeIn> */}

        {/* ── Price Breakdown ── */}
        <FadeIn delay={440}>
          <View style={styles.px}>
            <SectionHeader title="Price Details" />
            <View style={styles.card}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Subtotal</Text>
                <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.priceDivider} />
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Delivery Charges</Text>
                <Text style={styles.priceValue}>
                  ${deliveryCharges.toFixed(2)}
                </Text>
              </View>
              {couponApplied && (
                <>
                  <View style={styles.priceDivider} />
                  <View style={styles.priceRow}>
                    <Text style={[styles.priceLabel, { color: GREEN }]}>
                      Discount (NEWFUMES)
                    </Text>
                    <Text style={[styles.priceValue, { color: GREEN }]}>
                      - ${discount.toFixed(2)}
                    </Text>
                  </View>
                </>
              )}
              <View style={[styles.priceDivider, { borderStyle: "dashed" }]} />
              <View style={styles.priceRow}>
                <Text style={styles.priceTotalLabel}>Total Amount</Text>
                <Text style={styles.priceTotalValue}>${total.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </FadeIn>
      </ScrollView>

      {/* ── Sticky Footer ── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.footerTotal}>
          <Text style={styles.footerTotalLabel}>Total</Text>
          <Text style={styles.footerTotalValue}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          onPress={handleOrderPlacement}
          style={styles.placeOrderBtn}
          activeOpacity={0.88}
        >
          {isPlacingOrder ? (
            <ActivityIndicator size={"small"} />
          ) : (
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={WHITE}
              style={{ marginRight: 8 }}
            />
          )}

          <Text style={styles.placeOrderText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FAFAFA" },
  scroll: {},
  px: { paddingHorizontal: 20, marginBottom: 22 },

  // Top bar
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
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: GRAY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  pageTitle: { fontSize: 17, fontWeight: "700", color: DARK },

  // Section headers
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 22,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: DARK },
  sectionAction: { fontSize: 13, fontWeight: "600", color: ORANGE },

  // Card
  card: {
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  divider: { height: 1, backgroundColor: BORDER, marginLeft: 58 },

  // Order summary
  orderSummaryToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginTop: 16,
  },
  orderSummaryLeft: { flexDirection: "row", alignItems: "center" },
  orderSummaryRight: { flexDirection: "row", alignItems: "center" },
  orderBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  orderBubbleText: { color: WHITE, fontSize: 13, fontWeight: "700" },
  orderSummaryLabel: { fontSize: 15, fontWeight: "600", color: DARK },
  orderSummaryPrice: { fontSize: 15, fontWeight: "700", color: ORANGE },
  orderItemsContainer: {
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    marginTop: 10,
    overflow: "hidden",
  },
  orderItem: { flexDirection: "row", alignItems: "center", padding: 14 },
  orderItemImg: { width: 52, height: 52, borderRadius: 12 },
  orderItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: DARK,
    marginBottom: 2,
  },
  orderItemRest: { fontSize: 11, color: GRAY },
  orderItemPrice: { fontSize: 14, fontWeight: "700", color: DARK },
  orderItemQty: { fontSize: 11, color: GRAY, marginTop: 2 },

  // Address
  addressRow: { flexDirection: "row", alignItems: "center", padding: 16 },
  addressIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: GRAY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  addressTagRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  addressTag: { fontSize: 14, fontWeight: "700", color: DARK, marginRight: 8 },
  defaultBadge: {
    backgroundColor: ORANGE_LIGHT,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  defaultBadgeText: { fontSize: 10, fontWeight: "600", color: ORANGE },
  addressLine: { fontSize: 13, color: DARK, marginBottom: 1 },
  addressCity: { fontSize: 12, color: GRAY },

  // Radio
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ORANGE,
  },

  // Payment
  paymentRow: { flexDirection: "row", alignItems: "center", padding: 16 },
  paymentIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: GRAY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  paymentEmoji: { fontSize: 20 },
  paymentLabel: { fontSize: 14, fontWeight: "600", color: DARK },
  paymentSublabel: { fontSize: 12, color: GRAY, marginTop: 1 },

  // Stripe card fields
  stripeCard: {
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  stripeCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: DARK,
    marginBottom: 12,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GRAY_LIGHT,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 14, color: DARK },
  inputRow: { flexDirection: "row" },

  // Coupon
  couponRow: { flexDirection: "row", alignItems: "center" },
  couponInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  couponInput: { flex: 1, fontSize: 14, color: DARK, fontWeight: "600" },
  couponBtn: {
    backgroundColor: ORANGE,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  couponBtnText: { color: WHITE, fontSize: 14, fontWeight: "700" },

  // Price breakdown
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  priceDivider: { height: 1, backgroundColor: BORDER, marginHorizontal: 16 },
  priceLabel: { fontSize: 14, color: GRAY },
  priceValue: { fontSize: 14, fontWeight: "600", color: DARK },
  priceTotalLabel: { fontSize: 15, fontWeight: "700", color: DARK },
  priceTotalValue: { fontSize: 18, fontWeight: "700", color: ORANGE },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingHorizontal: 20,
    paddingTop: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  footerTotal: { marginRight: 16 },
  footerTotalLabel: {
    fontSize: 11,
    color: GRAY,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  footerTotalValue: { fontSize: 20, fontWeight: "700", color: DARK },
  placeOrderBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ORANGE,
    borderRadius: 14,
    paddingVertical: 15,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  placeOrderText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // Modal Styles
  overlay: {
    flex: 1,
    backgroundColor: "#00000080",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 10,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  message: { fontSize: 14, color: "#6e6e72", marginBottom: 20 },
  btn: {
    backgroundColor: "#FF611D",
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnText: { color: "#fff", fontWeight: "bold" },

  addNewAddress: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: ORANGE,
    borderStyle: "dashed",
    borderRadius: 14,
    paddingVertical: 13,
    margin: 20,
  },
  addAddressText: { fontSize: 14, fontWeight: "700", color: ORANGE },
});
