import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ORANGE = "#F97316";
const ORANGE_LIGHT = "#FFF4EE";
const DARK = "#1A1A1A";
const GRAY = "#9CA3AF";
const GRAY_LIGHT = "#F5F5F5";
const WHITE = "#FFFFFF";
const BORDER = "#F0F0F0";

const categories = [
  { id: "all", label: "All", icon: "apps-outline" },
  { id: "account", label: "Account", icon: "person-outline" },
  { id: "orders", label: "Orders", icon: "receipt-outline" },
  { id: "delivery", label: "Delivery", icon: "bicycle-outline" },
  { id: "payment", label: "Payment", icon: "card-outline" },
  { id: "technical", label: "Support", icon: "help-circle-outline" },
];

const faqs = [
  {
    category: "account",
    q: "Do I need an account to use Fumes?",
    a: "Yes, an account is required to place orders. This lets us save your addresses, track your orders, and personalise your experience. Sign up takes under a minute.",
  },
  {
    category: "account",
    q: "How do I reset my password?",
    a: 'On the login screen, tap "Forgot Password" and enter your registered email. A reset link will arrive within a few minutes. Check your spam folder if it doesn\'t appear.',
  },
  {
    category: "account",
    q: "How do I delete my account?",
    a: "Go to Profile > Account Settings > Delete Account. This permanently removes all your data including order history and saved addresses. This action cannot be undone.",
  },
  {
    category: "orders",
    q: "How do I place an order?",
    a: "Browse the menu, tap a dish to view details, choose your size and customizations, then add it to your cart. When ready, review your cart, select an address and payment method, then tap Place Order.",
  },
  {
    category: "orders",
    q: "Can I customise my order?",
    a: "Yes. Each menu item has available add-ons and toppings you can select before adding to cart. Options vary by dish.",
  },
  {
    category: "orders",
    q: "How do I apply a promo code?",
    a: "In the cart screen, enter your promo code in the coupon field and tap Apply. Valid codes: NEWFUMES (10% off) and SOUTH5 (5% off).",
  },
  {
    category: "orders",
    q: "Can I cancel my order?",
    a: 'Orders can be cancelled from the Orders screen while still in "Pending" status. Once an order moves to "Preparing" it cannot be cancelled.',
  },
  {
    category: "delivery",
    q: "How long does delivery take?",
    a: "Estimated delivery time is 25 to 35 minutes depending on your location and current order volume.",
  },
  {
    category: "delivery",
    q: "How are delivery charges calculated?",
    a: "A flat delivery charge of $20 applies to all orders regardless of distance or order size.",
  },
  {
    category: "delivery",
    q: "Can I save multiple delivery addresses?",
    a: "Yes. Go to Profile > Saved Addresses to add and manage multiple addresses. Tag them as Home, Work, or Other for quick selection during checkout.",
  },
  {
    category: "payment",
    q: "What payment methods are accepted?",
    a: "Fumes accepts Cash on Delivery, Credit/Debit Card (Visa, Mastercard, Amex), Google Pay, and Apple Pay (iOS only).",
  },
  {
    category: "payment",
    q: "Is my payment information secure?",
    a: "Yes. Payment details are processed by a secure gateway and are never stored on our servers. All transactions use SSL encryption.",
  },
  {
    category: "payment",
    q: "Will I receive a receipt?",
    a: "Your order details and total are visible in the Orders section of the app. Email receipts are planned for a future update.",
  },
  {
    category: "technical",
    q: "The app is slow or crashing. What should I do?",
    a: "Try closing and reopening the app. If the issue persists, check for updates in the App Store or Google Play. You can also try clearing the app cache.",
  },
  {
    category: "technical",
    q: "Why does Fumes need my location?",
    a: "Location is used to auto-fill your delivery address and show relevant menu items near you. You can deny permission and enter your address manually at any time.",
  },
  {
    category: "technical",
    q: "How do I contact support?",
    a: "Reach us at support@fumes.app. We aim to respond within 24 hours on business days.",
  },
];

export default function FAQ() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filtered = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={DARK} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Help & FAQ</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 40 },
        ]}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIconWrapper}>
            <Ionicons name="help-circle" size={32} color={ORANGE} />
          </View>
          <Text style={styles.heroTitle}>How can we help?</Text>
          <Text style={styles.heroSub}>
            Find answers to common questions below
          </Text>
        </View>

        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={18}
            color={GRAY}
            style={{ marginRight: 10 }}
          />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search questions..."
            placeholderTextColor={GRAY}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color={GRAY} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
          style={styles.categoryScrollWrapper}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                onPress={() => {
                  setActiveCategory(cat.id);
                  setExpandedIndex(null);
                }}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={14}
                  color={isActive ? WHITE : GRAY}
                  style={{ marginRight: 5 }}
                />
                <Text
                  style={[
                    styles.categoryLabel,
                    isActive && styles.categoryLabelActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Results count */}
        <Text style={styles.resultsCount}>
          {filtered.length} {filtered.length === 1 ? "question" : "questions"}
        </Text>

        <View style={styles.faqList}>
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={40} color={GRAY} />
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptyText}>
                Try a different search term or category
              </Text>
            </View>
          ) : (
            filtered.map((faq, index) => {
              const isOpen = expandedIndex === index;
              return (
                <View key={index} style={styles.faqCard}>
                  <TouchableOpacity
                    style={styles.faqHeader}
                    onPress={() =>
                      setExpandedIndex(isOpen ? null : index)
                    }
                    activeOpacity={0.7}
                  >
                    <View style={styles.faqHeaderLeft}>
                      <View
                        style={[
                          styles.faqIndicator,
                          isOpen && { backgroundColor: ORANGE },
                        ]}
                      />
                      <Text style={styles.faqQuestion}>{faq.q}</Text>
                    </View>
                    <Ionicons
                      name={isOpen ? "chevron-up" : "chevron-down"}
                      size={16}
                      color={GRAY}
                      style={{ marginLeft: 8 }}
                    />
                  </TouchableOpacity>

                  {isOpen && (
                    <View style={styles.faqBody}>
                      <Text style={styles.faqAnswer}>{faq.a}</Text>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>

        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Still need help?</Text>
          <Text style={styles.ctaText}>
            Our support team is ready to assist you
          </Text>
          <TouchableOpacity style={styles.ctaBtn}>
            <Ionicons
              name="mail-outline"
              size={16}
              color={WHITE}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.ctaBtnText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FAFAFA" },
  scroll: { paddingHorizontal: 20 },

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
  pageTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: DARK,
    fontFamily:
      Platform.OS === "ios" ? "SF Pro Display" : "sans-serif-medium",
  },

  hero: {
    alignItems: "center",
    paddingVertical: 28,
  },
  heroIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: ORANGE_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: DARK,
    marginBottom: 6,
    fontFamily:
      Platform.OS === "ios" ? "SF Pro Display" : "sans-serif-medium",
  },
  heroSub: {
    fontSize: 14,
    color: GRAY,
    textAlign: "center",
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: DARK,
  },

  categoryScrollWrapper: { marginBottom: 16 },
  categoryScroll: { gap: 8, paddingRight: 4 },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: WHITE,
  },
  categoryChipActive: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: GRAY,
  },
  categoryLabelActive: {
    color: WHITE,
  },

  resultsCount: {
    fontSize: 12,
    color: GRAY,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  faqList: { gap: 10, marginBottom: 24 },

  faqCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  faqHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  faqIndicator: {
    width: 4,
    height: 36,
    borderRadius: 2,
    backgroundColor: GRAY_LIGHT,
    marginRight: 12,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: "600",
    color: DARK,
    flex: 1,
    lineHeight: 20,
  },
  faqBody: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
    padding: 16,
    paddingTop: 14,
    backgroundColor: "#FAFAFA",
  },
  faqAnswer: {
    fontSize: 14,
    color: GRAY,
    lineHeight: 22,
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: DARK,
  },
  emptyText: {
    fontSize: 13,
    color: GRAY,
  },

  ctaCard: {
    backgroundColor: DARK,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: WHITE,
  },
  ctaText: {
    fontSize: 13,
    color: GRAY,
    textAlign: "center",
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ORANGE,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 8,
  },
  ctaBtnText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "700",
  },
});