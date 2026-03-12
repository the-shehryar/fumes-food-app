import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const ORANGE = "#F97316";
const ORANGE_LIGHT = "#FFF4EE";
const DARK = "#1A1A1A";
const GRAY = "#9CA3AF";
const GRAY_LIGHT = "#F5F5F5";
const WHITE = "#FFFFFF";
const BORDER = "#F0F0F0";

// ─── Types ────────────────────────────────────────────────────────────────────
type StatCardProps = { emoji: string; value: string; label: string };
type MenuRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sublabel?: string;
  iconBg: string;
  iconColor: string;
  delay?: number;
  isDestructive?: boolean;
  badge?: string;
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard: React.FC<StatCardProps> = ({ emoji, value, label }) => (
  <View style={styles.statCard}>
    <Text style={styles.statEmoji}>{emoji}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// ─── Menu Row ─────────────────────────────────────────────────────────────────
const MenuRow: React.FC<MenuRowProps> = ({
  icon,
  label,
  sublabel,
  iconBg,
  iconColor,
  delay = 0,
  isDestructive = false,
  badge,
}) => {
  const translateY = useRef(new Animated.Value(14)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 360,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 360,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <TouchableOpacity activeOpacity={0.7} style={styles.menuRow}>
        <View style={[styles.menuIconWrap, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={[styles.menuLabel, isDestructive && { color: "#EF4444" }]}
          >
            {label}
          </Text>
          {sublabel ? (
            <Text style={styles.menuSublabel}>{sublabel}</Text>
          ) : null}
        </View>
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : !isDestructive ? (
          <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
        ) : null}
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Section ──────────────────────────────────────────────────────────────────
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.card}>{children}</View>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const avatarAnim = useRef(new Animated.Value(0)).current;
  const infoAnim = useRef(new Animated.Value(14)).current;
  const infoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(avatarAnim, {
        toValue: 1,
        delay: 80,
        useNativeDriver: true,
        damping: 14,
        stiffness: 130,
      }),
      Animated.timing(infoAnim, {
        toValue: 0,
        duration: 360,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(infoOpacity, {
        toValue: 1,
        duration: 360,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={[styles.root]}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* ── Top Bar ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={22} color={DARK} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Profile</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="create-outline" size={20} color={DARK} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        {/* ── Avatar ── */}
        <Animated.View
          style={[
            styles.avatarBlock,
            {
              opacity: avatarAnim,
              transform: [
                {
                  scale: avatarAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.78, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.avatarOuter}>
            <View style={styles.avatarInner}>
              <Image
                source={{ uri: "https://i.pravatar.cc/150?img=11" }}
                style={styles.avatar}
              />
            </View>
            <TouchableOpacity style={styles.cameraBadge}>
              <Ionicons name="camera" size={13} color={WHITE} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ── Name / Email / Badge ── */}
        <Animated.View
          style={{
            opacity: infoOpacity,
            transform: [{ translateY: infoAnim }],
            alignItems: "center",
          }}
        >
          <Text style={styles.displayName}>Tom Hanks</Text>
          <View style={styles.emailRow}>
            <Ionicons
              name="mail-outline"
              size={13}
              color={GRAY}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.emailText}>tom.hanks@gmail.com</Text>
          </View>
          <View style={styles.memberBadge}>
            <Ionicons
              name="star"
              size={11}
              color={ORANGE}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.memberBadgeText}>Gold Member · Since 2022</Text>
          </View>
        </Animated.View>

        {/* ── Stats ── */}
        <Animated.View
          style={[
            styles.statsRow,
            { opacity: infoOpacity, transform: [{ translateY: infoAnim }] },
          ]}
        >
          <StatCard emoji="🛍️" value="48" label="Orders" />
          <View style={styles.statDivider} />
          <StatCard emoji="❤️" value="12" label="Saved" />
          <View style={styles.statDivider} />
          <StatCard emoji="⭐" value="4.8" label="Avg Rating" />
        </Animated.View>

        {/* ── Edit Button ── */}
        <Animated.View
          style={{
            opacity: infoOpacity,
            transform: [{ translateY: infoAnim }],
            paddingHorizontal: 20,
            marginBottom: 28,
          }}
        >
          <TouchableOpacity style={styles.editBtn} activeOpacity={0.85}>
            <Ionicons
              name="pencil-outline"
              size={16}
              color={WHITE}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Preferences ── */}
        <Section title="Preferences">
          <MenuRow
            icon="person-outline"
            label="Personal Info"
            sublabel="Name, phone, birthday"
            iconBg={ORANGE_LIGHT}
            iconColor={ORANGE}
            delay={300}
          />
          <View style={styles.divider} />
          <MenuRow
            icon="location-outline"
            label="Saved Addresses"
            sublabel="Home, Work & more"
            iconBg="#F0FDF4"
            iconColor="#16A34A"
            delay={350}
          />
          <View style={styles.divider} />
          <MenuRow
            icon="card-outline"
            label="Payment Methods"
            sublabel="Cards & wallets"
            iconBg="#EFF6FF"
            iconColor="#3B82F6"
            delay={400}
          />
          <View style={styles.divider} />
          <MenuRow
            icon="notifications-outline"
            label="Notifications"
            sublabel="Alerts & reminders"
            iconBg="#FFF7ED"
            iconColor="#F59E0B"
            delay={450}
          />
        </Section>

        {/* ── Activity ── */}
        <Section title="Activity">
          <MenuRow
            icon="receipt-outline"
            label="Order History"
            sublabel="48 past orders"
            iconBg={ORANGE_LIGHT}
            iconColor={ORANGE}
            delay={500}
            badge="48"
          />
          <View style={styles.divider} />
          <MenuRow
            icon="heart-outline"
            label="Favorites"
            sublabel="Saved restaurants & dishes"
            iconBg="#FFF1F2"
            iconColor="#F43F5E"
            delay={540}
          />
          <View style={styles.divider} />
          <MenuRow
            icon="star-outline"
            label="My Reviews"
            sublabel="Rate & review your orders"
            iconBg="#FEFCE8"
            iconColor="#EAB308"
            delay={580}
          />
        </Section>

        {/* ── Support ── */}
        <Section title="Support">
          <MenuRow
            icon="help-circle-outline"
            label="FAQs"
            iconBg="#F0FDF4"
            iconColor="#16A34A"
            delay={620}
          />
          <View style={styles.divider} />
          <MenuRow
            icon="document-text-outline"
            label="Terms of Service"
            iconBg="#EFF6FF"
            iconColor="#3B82F6"
            delay={660}
          />
          <View style={styles.divider} />
          <MenuRow
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            iconBg="#F5F3FF"
            iconColor="#8B5CF6"
            delay={700}
          />
          <View style={styles.divider} />
          <MenuRow
            icon="log-out-outline"
            label="Log Out"
            iconBg="#FFF1F2"
            iconColor="#EF4444"
            delay={740}
            isDestructive
          />
        </Section>
      </ScrollView>

      {/* ── Bottom Nav ── */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 4 }]}>
        {(
          ["home-outline", "search-outline", "cart-outline", "person"] as const
        ).map((ico, i) => (
          <TouchableOpacity key={ico} style={styles.navItem}>
            <Ionicons name={ico} size={22} color={i === 3 ? ORANGE : GRAY} />
            {i === 3 && <View style={styles.navDot} />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: WHITE },
  scroll: {},
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
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "sans-serif-medium",
  },
  avatarBlock: { alignItems: "center", marginTop: 28, marginBottom: 14 },
  avatarOuter: { position: "relative" },
  avatarInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: ORANGE,
  },
  avatar: { width: "100%", height: "100%" },
  cameraBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: WHITE,
  },
  displayName: {
    fontSize: 22,
    fontWeight: "700",
    color: DARK,
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "sans-serif-medium",
    marginBottom: 5,
  },
  emailRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  emailText: { fontSize: 13, color: GRAY },
  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ORANGE_LIGHT,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 6,
  },
  memberBadgeText: { fontSize: 12, color: ORANGE, fontWeight: "600" },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    backgroundColor: GRAY_LIGHT,
    borderRadius: 18,
    paddingVertical: 16,
    marginBottom: 20,
    marginTop: 10,
  },
  statCard: { flex: 1, alignItems: "center" },
  statEmoji: { fontSize: 20, marginBottom: 4 },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: DARK,
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "sans-serif-medium",
  },
  statLabel: {
    fontSize: 11,
    color: GRAY,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: BORDER,
    alignSelf: "center",
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ORANGE,
    borderRadius: 14,
    paddingVertical: 14,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 6,
  },
  editBtnText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  section: { marginBottom: 20, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: GRAY,
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginBottom: 10,
    marginLeft: 2,
  },
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
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: DARK,
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "sans-serif-medium",
  },
  menuSublabel: { fontSize: 12, color: GRAY, marginTop: 1 },
  badge: {
    backgroundColor: ORANGE_LIGHT,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 12, fontWeight: "700", color: ORANGE },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 10,
  },
  navItem: { flex: 1, alignItems: "center", paddingVertical: 4 },
  navDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: ORANGE,
    marginTop: 3,
  },
});
