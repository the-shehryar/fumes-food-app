import Stars from "@/app/components/Stars";
import { getStoredData } from "@/libs/asyncStorage";
import { MenuItem } from "@/type";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const HERO_HEIGHT = height * 0.44;

// ─── Tokens ───────────────────────────────────────────────────────────────────

const ORANGE = "#F97316";
const ORANGE_LIGHT = "#FFF4EE";
const DARK = "#1A1A1A";
const GRAY = "#9CA3AF";
const GRAY_LIGHT = "#F5F5F5";
const WHITE = "#FFFFFF";
const BORDER = "#F0F0F0";
const GREEN = "#16A34A";
const GREEN_LIGHT = "#F0FDF4";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const PRODUCT = {
  name: "Smash Beef Burger — The Good Burger Joint",
  restaurant: "The Good Burger Joint",
  address: "Grover St, Bloomsbury Tower, Lahore",
  rating: 4,
  calories: 689,
  price: 17.99,
  totalPrice: 35.98,
  description:
    "We take premium ground beef, smash it hard onto a screaming-hot griddle, and let physics do the rest. The result? Lacy, caramelized edges that shatter at first bite and a juicy center that reminds you what a burger should taste like. Topped with melted American cheese, crisp lettuce, ripe tomato, pickles, and onions, all tucked into a buttery toasted bun with our tangy house sauce. Simple ingredients, perfect technique, unforgettable flavor. This is how burgers are meant to be.",
  image:
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=90",
  tags: ["Beef", "Cheese", "Grilled", "Best Seller"],
};

const TOPPINGS = [
  { id: "t1", icon: "🧀", label: "Extra Cheese", price: 1.25 },
  { id: "t2", icon: "🥩", label: "Extra Meat Patty", price: 5.25 },
  { id: "t3", icon: "🥑", label: "Avocado Slice", price: 1.75 },
  { id: "t4", icon: "🥓", label: "Crispy Bacon", price: 2.5 },
  { id: "t5", icon: "🌶️", label: "Jalapeños", price: 0.75 },
  { id: "t6", icon: "🍳", label: "Fried Egg", price: 1.0 },
];

const SIDES = [
  { id: "s1", icon: "🍟", label: "Loaded Fries", price: 3.49 },
  { id: "s2", icon: "🥗", label: "Garden Salad", price: 2.99 },
  { id: "s3", icon: "🧅", label: "Onion Rings", price: 2.75 },
  { id: "s4", icon: "🥤", label: "Soft Drink (330ml)", price: 1.5 },
  { id: "s5", icon: "🍦", label: "Vanilla Soft Serve", price: 1.99 },
  { id: "s6", icon: "🫙", label: "Coleslaw Cup", price: 1.25 },
];

const RELATED = [
  {
    id: "r1",
    name: "Double Smash",
    price: 22.99,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&q=80",
  },
  {
    id: "r2",
    name: "Crispy Chicken",
    price: 15.99,
    image:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300&q=80",
  },
  {
    id: "r3",
    name: "Veggie Burger",
    price: 13.99,
    image:
      "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=300&q=80",
  },
];

type ExtraItem = {
  id: string;
  icon: string;
  label: string;
  price: number;
  type?: string;
};
type ExtraRowProps = {
  item: ExtraItem;
  checked: boolean;
  onToggle: () => void;
};
// ─── Extra Item Row ───────────────────────────────────────────────────────────
function ExtraRow({ item, checked, onToggle }: ExtraRowProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
        speed: 80,
      }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 80 }),
    ]).start();
    onToggle();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={styles.extraRow}
        onPress={handlePress}
        activeOpacity={0.85}
      >
        <View style={styles.extraIconWrap}>
          <Text style={styles.extraIcon}>{item.icon}</Text>
        </View>
        <Text style={styles.extraLabel}>{item.label}</Text>
        <Text style={styles.extraPrice}>${item.price.toFixed(2)}</Text>

        <View
          style={[styles.extraCheckbox, checked && styles.extraCheckboxChecked]}
        >
          {checked && <Ionicons name="checkmark" size={13} color={WHITE} />}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ProductScreen() {
  let [product, setProduct] = useState<MenuItem | null>(null);
  let { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [qty, setQty] = useState(2);
  const [liked, setLiked] = useState(false);
  const [checkedExtras, setCheckedExtras] = useState<Record<string, boolean>>(
    {},
  );
  const [descExpanded, setDescExpanded] = useState(false);
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

  const likeScale = useRef(new Animated.Value(1)).current;

  const allExtras = [...TOPPINGS, ...SIDES];

  //? filters through the selected extra (state) then sums the price of the filtered array (containing checked items)

  const extrasTotal = allExtras
    .filter((extra) => checkedExtras[extra.id])
    .reduce((sum, extra) => sum + extra.price, 0);

  const orderTotal = (PRODUCT.price * qty + extrasTotal).toFixed(2);

  //? Toggle Checkboxes
  const toggleExtra = (id: string) => {
    setCheckedExtras((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  //*  Like animation I don't really like it, by default like is false
  const toggleLike = () => {
    Animated.sequence([
      Animated.spring(likeScale, {
        toValue: 1.4,
        useNativeDriver: true,
        speed: 80,
      }),
      Animated.spring(likeScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 60,
      }),
    ]).start();
    setLiked((l) => !l);
  };

  // Parallax hero
  const heroTranslate = scrollY.interpolate({
    inputRange: [-100, 0, HERO_HEIGHT],
    outputRange: [50, 0, -HERO_HEIGHT * 0.3],
    extrapolate: "clamp",
  });

  // Header scroll-driven animations
  const headerBg = scrollY.interpolate({
    inputRange: [HERO_HEIGHT - 80, HERO_HEIGHT - 20],
    outputRange: ["rgba(255,255,255,0)", "rgba(255,255,255,1)"],
    extrapolate: "clamp",
  });
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [HERO_HEIGHT - 60, HERO_HEIGHT],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const headerBorderOpacity = scrollY.interpolate({
    inputRange: [HERO_HEIGHT - 20, HERO_HEIGHT + 10],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  // Buttons: dark pill → light gray pill
  const btnBg = scrollY.interpolate({
    inputRange: [HERO_HEIGHT - 80, HERO_HEIGHT - 20],
    outputRange: ["rgba(0,0,0,0.32)", "rgba(245,245,245,1)"],
    extrapolate: "clamp",
  });
  // Icons: white → dark
  const iconOpacityWhite = scrollY.interpolate({
    inputRange: [HERO_HEIGHT - 80, HERO_HEIGHT - 20],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const iconOpacityDark = scrollY.interpolate({
    inputRange: [HERO_HEIGHT - 80, HERO_HEIGHT - 20],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const AnimatedBtn: React.FC<{ name: string; style?: object }> = ({
    name,
    style,
  }) => (
    <Animated.View
      style={[styles.floatingBtn, { backgroundColor: btnBg }, style]}
    >
      <TouchableOpacity style={styles.floatingBtnInner}>
        {/* White icon (visible when transparent) */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.iconCenter,
            { opacity: iconOpacityWhite },
          ]}
        >
          <Ionicons name={name as any} size={19} color={WHITE} />
        </Animated.View>
        {/* Dark icon (visible when white) */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.iconCenter,
            { opacity: iconOpacityDark },
          ]}
        >
          <Ionicons name={name as any} size={19} color={DARK} />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );

  const fetchItemData = async () => {
    try {
      let localProducts = await getStoredData("mainMenu");
      if (localProducts) {
        let foundItem = localProducts.find((item) => item.$id === id);
        if (product) {
          if (foundItem?.$id === product?.$id) {
            return;
          }
        } else if (product === null) {
          setProduct((foundItem as MenuItem) || {});
        }
      }
    } catch (error) {
      setProduct(null);
    }
  };

  useEffect(() => {
    fetchItemData();
  }, [product, id]);

  return (
    //* if product is not null
    product !== null ? (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" />

        {/* ── Floating Header ── */}
        <Animated.View
          style={[
            styles.floatingHeader,
            { backgroundColor: headerBg, paddingTop: insets.top + 4 },
          ]}
        >
          {/* Bottom border fades in with white bg */}
          <Animated.View
            style={[
              styles.floatingHeaderBorder,
              { opacity: headerBorderOpacity },
            ]}
          />

          <AnimatedBtn name="chevron-back" />

          <Animated.Text
            style={[styles.floatingTitle, { opacity: headerTitleOpacity }]}
            numberOfLines={1}
          >
            {product.name}
          </Animated.Text>

          <View style={{ flexDirection: "row" }}>
            <AnimatedBtn name="search-outline" style={{ marginRight: 8 }} />
            <AnimatedBtn name="share-social-outline" />
          </View>
        </Animated.View>

        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false },
          )}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
        >
          {/* ── Hero Image ── */}
          <View style={styles.heroWrap}>
            <Animated.Image
              source={{ uri: product.image_url }}
              style={[
                styles.heroImg,
                { transform: [{ translateY: heroTranslate }] },
              ]}
            />
            {/* Gradient overlay */}
            <LinearGradient
              colors={["rgba(0,0,0,0.38)", "rgba(0,0,0,0)", "rgba(0,0,0,0)"]}
              style={StyleSheet.absoluteFill}
            />
          </View>

          <View style={styles.sheet}>
            <View style={styles.titleRow}>
              <Text style={styles.productName}>{product.name}</Text>
              <Animated.View style={{ transform: [{ scale: likeScale }] }}>
                <TouchableOpacity
                  style={[styles.likeBtn, liked && styles.likeBtnActive]}
                  onPress={toggleLike}
                >
                  <Ionicons
                    name={liked ? "heart" : "heart-outline"}
                    size={20}
                    color={liked ? WHITE : GRAY}
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Address no need to add this  */}
            <View style={styles.addressRow}>
              <Ionicons
                name="location-outline"
                size={14}
                color={GRAY}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.addressText}>{PRODUCT.address}</Text>
            </View>

            {/* Metadata Row */}
            <View style={styles.metaRow}>
              <View style={styles.metaChip}>
                <Stars rating={product.rating} size={13} />
                <Text style={styles.metaChipText}>{product.rating}</Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaChip}>
                <Ionicons name="flame-outline" size={14} color={ORANGE} />
                <Text style={styles.metaChipText}>{product.calories} KCal</Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaChip}>
                <Ionicons name="time-outline" size={14} color={GREEN} />
                <Text style={[styles.metaChipText, { color: GREEN }]}>
                  25-35 min
                </Text>
              </View>
            </View>

            {/* ── Price ── */}
            <View style={styles.priceRow}>
              <View>
                <Text style={styles.priceLabel}>Price</Text>
                <Text style={styles.priceValue}>
                  ${product.price.toFixed(2)}
                </Text>
              </View>
              <View style={styles.ratingBadge}>
                <Ionicons
                  name="star"
                  size={13}
                  color="#FBBF24"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.ratingBadgeText}>4.0 · 134 reviews</Text>
              </View>
            </View>

            {/* ── Description ── */}
            <View style={styles.descSection}>
              <Text style={styles.descLabel}>Description</Text>
              <Text
                style={styles.descText}
                numberOfLines={descExpanded ? undefined : 3}
              >
                {product.description}
              </Text>
              <TouchableOpacity onPress={() => setDescExpanded((e) => !e)}>
                <Text style={styles.descToggle}>
                  {descExpanded ? "Show less ↑" : "Read more ↓"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* ── Extra Ingredients ── */}
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
                  {Object.keys(checkedExtras).filter(
                    (id) => id.startsWith("t") && checkedExtras[id],
                  ).length > 0 && (
                    <View style={styles.tabBadge}>
                      <Text style={styles.tabBadgeText}>
                        {
                          Object.keys(checkedExtras).filter(
                            (id) => id.startsWith("t") && checkedExtras[id],
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
                {(activeTab === "toppings" ? TOPPINGS : SIDES).map(
                  (extra, index, arr) => (
                    <View key={extra.id}>
                      <ExtraRow
                        item={extra}
                        checked={!!checkedExtras[extra.id]}
                        //* !! is advance notation for double checking boolean i know hard to understand but !!undefined if id is not
                        //* checkedExtras array at initial stage so it will parse like undefined is falsy value so !undefined will be true(not falsy)
                        //* !undefined is true so !!undefined will be false again if we had only true and false only one ! sign would have worked
                        onToggle={() => toggleExtra(extra.id)}
                        //* toggleExtra(extra.id) will add id in checkedExtras array so upon change we can update UI
                      />
                      {/* Adding divider for every element except the last one cuz there index will be */}
                      {/* equal to arr.length - 1 so no rendering of divider */}
                      {index < arr.length - 1 && (
                        <View style={styles.extraDivider} />
                      )}
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

            {/* ── You May Also Like ── */}
            <View style={styles.relatedSection}>
              <Text style={styles.relatedTitle}>From the Same Restaurant</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedScroll}
              >
                {RELATED.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.relatedCard}
                    activeOpacity={0.85}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={styles.relatedImg}
                    />
                    <Text style={styles.relatedName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View style={styles.relatedFooter}>
                      <Text style={styles.relatedPrice}>${item.price}</Text>
                      <TouchableOpacity style={styles.relatedAddBtn}>
                        <Ionicons name="add" size={16} color={WHITE} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Animated.ScrollView>

        {/* ── Sticky Footer ── */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          {/* Qty controls */}
          <View style={styles.footerQty}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQty((q) => Math.max(1, q - 1))}
            >
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyNum}>{qty}</Text>
            <TouchableOpacity
              style={[styles.qtyBtn, styles.qtyBtnFill]}
              onPress={() => setQty((q) => q + 1)}
            >
              <Text style={[styles.qtyBtnText, { color: WHITE }]}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Place order */}
          <TouchableOpacity style={styles.placeOrderBtn} activeOpacity={0.88}>
            <Text style={styles.placeOrderText}>
              Place Order — ${orderTotal}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    ) : (
      ""
    )
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: WHITE },

  // Floating header
  floatingHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  floatingHeaderBorder: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: BORDER,
  },
  floatingTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: DARK,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  floatingBtn: { width: 38, height: 38, borderRadius: 19, overflow: "hidden" },
  floatingBtnInner: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCenter: { alignItems: "center", justifyContent: "center" },

  // Hero
  heroWrap: {
    width,
    height: HERO_HEIGHT,
    overflow: "hidden",
    position: "relative",
  },
  heroImg: {
    width,
    height: HERO_HEIGHT + 60,
    resizeMode: "cover",
    marginTop: -30,
  },
  heroTopRow: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.28)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTags: {
    position: "absolute",
    bottom: 16,
    left: 16,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  heroTag: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  heroTagText: { color: WHITE, fontSize: 11, fontWeight: "600" },

  // Sheet
  sheet: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -26,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  // Title
  titleRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  productName: {
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
    color: DARK,
    lineHeight: 27,
    paddingRight: 12,
  },
  likeBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: GRAY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  likeBtnActive: { backgroundColor: "#FB7185" },

  // Address
  addressRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  addressText: { fontSize: 13, color: GRAY, flex: 1 },

  // Meta
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GRAY_LIGHT,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  metaChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  metaChipText: { fontSize: 13, fontWeight: "600", color: DARK, marginLeft: 5 },
  metaDivider: { width: 1, height: 20, backgroundColor: BORDER },

  // Price
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 11,
    color: ORANGE,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  priceValue: { fontSize: 26, fontWeight: "800", color: DARK },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEFCE8",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  ratingBadgeText: { fontSize: 12, fontWeight: "600", color: "#92400E" },

  // Description
  descSection: { marginBottom: 24 },
  descLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: ORANGE,
    marginBottom: 8,
  },
  descText: { fontSize: 13.5, color: GRAY, lineHeight: 21 },
  descToggle: { fontSize: 13, fontWeight: "700", color: ORANGE, marginTop: 6 },

  // Extras
  extrasSection: { marginBottom: 24 },
  extrasTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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
