import { useCartStore } from "@/stores/cart.store";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import CartItem from "../components/CartItem";
import EmptyCart from "../components/EmptyCart";
import { router } from "expo-router";
import { Coupon } from "@/types/type";

const ORANGE = "#F97316";
const ORANGE_LIGHT = "#FFF4EE";
const DARK = "#1A1A1A";
const GRAY = "#9CA3AF";
const GRAY_LIGHT = "#F5F5F5";
const WHITE = "#FFFFFF";
const BORDER = "#F0F0F0";
const GREEN = "#16A34A";
const GREEN_LIGHT = "#F0FDF4";
const RED = "#EF4444";
const RED_LIGHT = "#FFF1F2";


export default function CartScreen() {
  const {
    items,
    addItem,
    removeItem,
    increaseQty,
    decreaseQty,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  const insets = useSafeAreaInsets();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const [coupon, setCoupon] = useState<Coupon>({code : "NEWFUMES", discount : 10});
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [discount, setDiscount] = useState(0)
  let {deliveryCharges} = useCartStore()


  let discountApplied = couponApplied ? ((totalPrice + deliveryCharges) * coupon.discount /100).toFixed(2) : ""


  useEffect(() => {
    console.log("Cart Items:", items);
    console.log("Total Items:", totalItems);
    console.log("Total Price:", getTotalPrice());
  }, [items, totalItems, totalPrice, couponApplied]);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "flex-start",
          backgroundColor: "#fefefe",
        }}
      >

        <View
          style={{
            width: "100%",
            height: 60,
            justifyContent: "center",
            alignItems: "center",
            elevation: 5,
            shadowColor: "#00000069",
          }}
        >
          <Text
            style={{
              fontWeight: 600,
              fontSize: 18,
              marginBottom: 20,
            }}
          >
            Shopping Cart
          </Text>
        </View>

        {items.length > 0 ? (
          <>
            <View
              style={{
                width: "100%",
                height: Dimensions.get("window").height - 260,
              }}
            >
              <FlatList
                style={{ width: "100%" }}
                data={items}
                renderItem={({ item, index }) => {
                  return <CartItem item={item} index={index} />;
                }}
                // Seprate Uids to aviod key conflict of multiple entries of signle items
                keyExtractor={(item) => item.uid}
                ListFooterComponent={
                  <View style={{ marginTop: 20 }}>
                    {/* ── Coupon ── */}
                    <View style={styles.px}>
                      <View style={styles.couponCard}>
                        <Ionicons
                          name="pricetag-outline"
                          size={18}
                          color={couponApplied ? GREEN : GRAY}
                          style={{ marginRight: 10 }}
                        />
                        <TextInput
                          value={coupon.code}
                          onChangeText={(text) => {
                            setCoupon(prev => ({...prev, code : text}));
                            if (couponApplied) setCouponApplied(false);
                          }}
                          placeholder="Promo code"
                          placeholderTextColor={GRAY}
                          style={styles.couponInput}
                          autoCapitalize="characters"
                        />
                        <TouchableOpacity
                          style={[
                            styles.couponApplyBtn,
                            couponApplied && { backgroundColor: GREEN_LIGHT },
                          ]}
                          onPress={() =>
                            coupon.code.length > 0 &&
                            setCouponApplied(!couponApplied)
                          }
                        >
                          <Text
                            style={[
                              styles.couponApplyText,
                              couponApplied && { color: GREEN },
                            ]}
                          >
                            {couponApplied ? "Applied" : "Apply"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* ── Bill Summary ── */}

                    <View style={styles.px}>
                      <TouchableOpacity style={styles.addMoreBtn}>
                        <Ionicons
                          name="add-circle-outline"
                          size={20}
                          color={ORANGE}
                          style={{ marginRight: 8 }}
                        />
                        <Text style={styles.addMoreText}>Add more items</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.px}>
                      <Text style={styles.sectionTitle}>Bill Summary</Text>
                      <View style={styles.billCard}>
                        <View style={styles.billRow}>
                          <Text style={styles.billLabel}>Subtotal</Text>
                          <Text style={styles.billValue}>${totalPrice}</Text>
                        </View>
                        <View style={styles.billDivider} />
                        <View style={styles.billRow}>
                          <Text style={styles.billLabel}>Delivery Charges</Text>
                          <Text style={styles.billValue}>
                            ${deliveryCharges}
                          </Text>
                        </View>
                        {couponApplied && (
                          <>
                            <View style={styles.billDivider} />
                            <View style={styles.billRow}>
                              <Text
                                style={[styles.billLabel, { color: GREEN }]}
                              >
                                Discount
                              </Text>
                              <Text
                                style={[styles.billValue, { color: GREEN }]}
                              >{discountApplied}</Text>
                            </View>
                          </>
                        )}
                        <View
                          style={[
                            styles.billDivider,
                            { borderStyle: "dashed" },
                          ]}
                        />

                        {/* Need to fix this */}
                        <View style={styles.billRow}>
                          <Text style={styles.billTotalLabel}>
                            Total Amount
                          </Text>
                          <Text style={styles.billTotalValue}>
                            ${((totalPrice + deliveryCharges) - parseFloat(discountApplied))}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* ── Delivery Note ── */}
                    <View style={styles.px}>
                      <View style={styles.deliveryNote}>
                        <Ionicons
                          name="bicycle-outline"
                          size={18}
                          color={ORANGE}
                          style={{ marginRight: 10 }}
                        />
                        <Text style={styles.deliveryNoteText}>
                          Estimated delivery:{" "}
                          <Text style={{ fontWeight: "700", color: DARK }}>
                            25-35 min
                          </Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                }
              />
            </View>

            <View
              style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}
            >
              <View style={styles.footerInfo}>
                <Text style={styles.footerLabel}>Total</Text>
                <Text style={styles.footerTotal}>
                  ${((totalPrice + deliveryCharges) - parseFloat(discountApplied))}
                </Text>
              </View>
              <TouchableOpacity style={styles.checkoutBtn} onPress={()=> router.push('/checkout')} activeOpacity={0.88}>
                <Text style={styles.checkoutText}>CHECKOUT</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <EmptyCart />
        )}
        {/* <CheckoutFormSheet/> */}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  px: { paddingHorizontal: 20, marginBottom: 18 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: DARK,
    marginBottom: 12,
  },
  suggestScroll: { paddingHorizontal: 20, paddingBottom: 4 },
  suggestCard: {
    width: 120,
    backgroundColor: WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: "hidden",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  suggestImg: { width: "100%", height: 80, resizeMode: "cover" },
  suggestName: {
    fontSize: 12,
    fontWeight: "600",
    color: DARK,
    padding: 8,
    paddingBottom: 4,
  },
  suggestFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
  suggestPrice: { fontSize: 13, fontWeight: "700", color: DARK },
  suggestAddBtn: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: DARK,
    alignItems: "center",
    justifyContent: "center",
  },

  // Coupon
  couponCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  couponInput: { flex: 1, fontSize: 14, fontWeight: "700", color: DARK },
  couponApplyBtn: {
    backgroundColor: ORANGE_LIGHT,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  couponApplyText: { fontSize: 13, fontWeight: "700", color: ORANGE },

  // Bill
  billCard: {
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
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  billDivider: { height: 1, backgroundColor: BORDER, marginHorizontal: 16 },
  billLabel: { fontSize: 14, color: GRAY },
  billValue: { fontSize: 14, fontWeight: "600", color: DARK },
  billTotalLabel: { fontSize: 15, fontWeight: "700", color: DARK },
  billTotalValue: { fontSize: 18, fontWeight: "800", color: ORANGE },

  // Delivery note
  deliveryNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ORANGE_LIGHT,
    borderRadius: 14,
    padding: 14,
  },
  deliveryNoteText: { fontSize: 13, color: GRAY },

  // Footer
  footer: {
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingHorizontal: 20,
    paddingTop: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 12,
  },
  footerInfo: { marginRight: 16 },
  footerLabel: {
    fontSize: 11,
    color: GRAY,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  footerTotal: { fontSize: 20, fontWeight: "800", color: DARK },
  checkoutBtn: {
    flex: 1,
    backgroundColor: ORANGE,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  checkoutText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1,
  },

  // Add more
  addMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: ORANGE,
    borderStyle: "dashed",
    borderRadius: 14,
    paddingVertical: 13,
  },
  addMoreText: { fontSize: 14, fontWeight: "700", color: ORANGE },


});
