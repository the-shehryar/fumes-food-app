import { CartCustomization } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import ExtraRow from "./ExtraRow";

const ORANGE = "#F97316";
const ORANGE_LIGHT = "#FFF4EE";
const DARK = "#1A1A1A";
const GRAY = "#9CA3AF";
const GRAY_LIGHT = "#F5F5F5";
const WHITE = "#FFFFFF";
const BORDER = "#F0F0F0";
const GREEN = "#16A34A";
const GREEN_LIGHT = "#F0FDF4";

const { width, height } = Dimensions.get("window");
const HERO_HEIGHT = height * 0.44;

function Extras({ items }: { items: CartCustomization[] }) {
  const [checkedExtras, setCheckedExtras] = useState<Record<string, boolean>>(
    {},
  );
  let [toppings, setToppings] = useState<CartCustomization[] | []>([]);
  let [sides, setSides] = useState<CartCustomization[] | []>([]);

  const [activeTab, setActiveTab] = useState<"toppings" | "sides">("toppings");
  const tabIndicator = useRef(new Animated.Value(0)).current;

  const switchTab = (tab: "toppings" | "sides") => {
    setActiveTab(tab);
    Animated.spring(tabIndicator, {
      toValue: tab === "toppings" ? 0 : 1,
      useNativeDriver: true,
      damping: 18,
      stiffness: 160,
    }).start();
  };

  const allExtras = items;
  const extrasTotal =
    allExtras.length > 0
      ? allExtras
          .filter((extra) => checkedExtras[extra.id])
          .reduce((sum, extra) => sum + extra.price, 0)
      : 0;

  const toggleExtra = (id: string) => {
    // If it exists remove if not add
    items.filter(item => item.id === id ? item.checked = !item.checked : "")
    setCheckedExtras((prev) => ({ ...prev, [id]: !prev[id] }));
    console.log(checkedExtras);
    console.log(items)
  };

  function setCustomizationsStates() {
    let newToppings = items.filter((item) => item.type === "topping");
    let newSides = items.filter((item) => item.type === "side");
    setToppings(newToppings);
    setSides(newSides);
  }
  useEffect(()=>{
    setCustomizationsStates()
  }, [activeTab])

  return (
    <View style={styles.extrasSection}>
      {/* Header */}
      <View style={styles.extrasTitleRow}>
        <Text style={styles.extrasTitle}>Add extra ingredients</Text>
        <View style={styles.optionalBadge}>
          <Text style={styles.optionalText}>Optional</Text>
        </View>
      </View>

      {/* Tab switcher */}
      <View style={styles.tabBar}>
        {/* Sliding pill background */}
        <Animated.View
          style={[
            styles.tabPill,
            {
              transform: [
                {
                  translateX: tabIndicator.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, (width - 40 - 8) / 2],
                  }),
                },
              ],
            },
          ]}
        />
        {/* Simple button that changes appearances once selected/pressed by adding extra CSS class*/}
        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => switchTab("toppings")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === "toppings" && styles.tabLabelActive,
            ]}
          >
            Toppings
          </Text>
          {/* Adding badge upon selecting topping for an order */}
          {items.filter(
            (item) => item.type === 'topping' && checkedExtras[item.id],
          ).length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>
                {
                  items.filter(
                    (item) => item.checked && item.type === 'topping' ? item : "",
                  ).length
                }
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Simple button that changes appearances once selected/pressed by adding extra CSS class*/}
        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => switchTab("sides")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === "sides" && styles.tabLabelActive,
            ]}
          >
            Sides
          </Text>
          {/* Adding badge upon selecting sides for an order */}
          {Object.keys(checkedExtras).filter(
            (id) => id.startsWith("s") && checkedExtras[id],
          ).length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>
                {
                  Object.keys(checkedExtras).filter(
                    (id) => id.startsWith("s") && checkedExtras[id],
                  ).length
                }
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Items list */}
      <View style={styles.extrasCard}>
        {(activeTab === "toppings" ? toppings : sides).map(
          (extra, index, arr) => (
            <View key={extra.id}>
              <ExtraRow
                item={extra}
                checked={extra.checked}
                //* !! is advance notation for double checking boolean i know hard to understand but !!undefined if id is not
                //* checkedExtras array at initial stage so it will parse like undefined is falsy value so !undefined will be true(not falsy)
                //* !undefined is true so !!undefined will be false again if we had only true and false only one ! sign would have worked
                onToggle={() => toggleExtra(extra.id)}
                //* toggleExtra(extra.id) will add id in checkedExtras array so upon change we can update UI
              />
              {/* Adding divider for every element except the last one cuz there index will be */}
              {/* equal to arr.length - 1 so no rendering of divider */}
              {index < arr.length - 1 && <View style={styles.extraDivider} />}
            </View>
          ),
        )}
      </View>

      {/* Combined selected summary */}
      {extrasTotal > 0 && (
        <View style={styles.extrasSummary}>
          <Ionicons
            name="checkmark-circle"
            size={15}
            color={GREEN}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.extrasSummaryText}>
            {allExtras.filter((e) => checkedExtras[e.id]).length} extra
            {allExtras.filter((e) => checkedExtras[e.id]).length > 1
              ? "s"
              : ""}{" "}
            added
          </Text>
          <Text style={styles.extrasSummaryPrice}>
            +${extrasTotal.toFixed(2)}
          </Text>
        </View>
      )}
    </View>
  );
}

export default Extras;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: WHITE },
  // Extras
  extrasSection: { width : "100%", marginBottom: 24 },
  extrasTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  extrasTitle: { fontSize: 15, fontWeight: "700", color: DARK, marginRight: 8 },
  optionalBadge: {
    backgroundColor: GREEN_LIGHT,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  optionalText: { fontSize: 11, color: GREEN, fontWeight: "600" },

  // Tab switcher
  tabBar: {
    flexDirection: "row",
    backgroundColor: GRAY_LIGHT,
    borderRadius: 14,
    padding: 4,
    marginBottom: 12,
    position: "relative",
  },
  tabPill: {
    position: "absolute",
    top: 4,
    left: 4,
    bottom: 4,
    width: "50%",
    backgroundColor: WHITE,
    borderRadius: 11,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 11,
    zIndex: 1,
  },
  tabLabel: { fontSize: 14, fontWeight: "600", color: GRAY },
  tabLabelActive: { color: DARK },
  tabBadge: {
    marginLeft: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  tabBadgeText: { fontSize: 10, fontWeight: "800", color: WHITE },

  extrasCard: {
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
  extraRow: {
    width : "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  extraIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: GRAY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  extraIcon: { fontSize: 18 },
  extraLabel: { flex: 1, fontSize: 14, fontWeight: "500", color: DARK },
  extraPrice: { fontSize: 14, fontWeight: "700", color: DARK, marginRight: 14 },
  extraCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  extraCheckboxChecked: { backgroundColor: ORANGE, borderColor: ORANGE },
  extraDivider: { height: 1, backgroundColor: BORDER, marginLeft: 64 },

  // Extras summary bar
  extrasSummary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GREEN_LIGHT,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 10,
  },
  extrasSummaryText: { flex: 1, fontSize: 13, fontWeight: "600", color: GREEN },
  extrasSummaryPrice: { fontSize: 14, fontWeight: "800", color: GREEN },

  // Related
  relatedSection: { marginBottom: 10 },
  relatedTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: DARK,
    marginBottom: 12,
  },
  relatedScroll: { paddingBottom: 4 },
  relatedCard: {
    width: 130,
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
  relatedImg: { width: "100%", height: 86, resizeMode: "cover" },
  relatedName: {
    fontSize: 12,
    fontWeight: "600",
    color: DARK,
    padding: 8,
    paddingBottom: 4,
  },
  relatedFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
  relatedPrice: { fontSize: 13, fontWeight: "700", color: DARK },
  relatedAddBtn: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: DARK,
    alignItems: "center",
    justifyContent: "center",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingHorizontal: 20,
    paddingTop: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 12,
  },
  footerQty: { flexDirection: "row", alignItems: "center", marginRight: 16 },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnFill: { backgroundColor: DARK, borderColor: DARK },
  qtyBtnText: { fontSize: 18, fontWeight: "700", color: DARK },
  qtyNum: {
    fontSize: 17,
    fontWeight: "800",
    color: DARK,
    marginHorizontal: 14,
    minWidth: 20,
    textAlign: "center",
  },
  placeOrderBtn: {
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
  placeOrderText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
