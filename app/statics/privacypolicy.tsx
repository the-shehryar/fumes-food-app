import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
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

const sections = [
  {
    icon: "shield-checkmark-outline",
    title: "Information We Collect",
    content: [
      {
        subtitle: "What you provide",
        text: "Name, email address, delivery addresses, and order preferences when you create and use your account.",
      },
      {
        subtitle: "What we collect automatically",
        text: "Device type, OS version, IP address, usage patterns, and crash reports via Sentry to improve app stability.",
      },
      {
        subtitle: "Location data",
        text: "Precise location only when you grant permission, used solely to auto-fill your delivery address. Never tracked in the background.",
      },
    ],
  },
  {
    icon: "analytics-outline",
    title: "How We Use Your Data",
    content: [
      {
        subtitle: "Order fulfilment",
        text: "To process your orders, calculate delivery estimates, and send order status updates.",
      },
      {
        subtitle: "App improvement",
        text: "To identify bugs, optimise performance, and personalise your experience with relevant menu items.",
      },
      {
        subtitle: "Security",
        text: "To detect and prevent fraudulent activity and protect your account.",
      },
    ],
  },
  {
    icon: "lock-closed-outline",
    title: "Data Storage & Security",
    content: [
      {
        subtitle: "Infrastructure",
        text: "Your data is stored on Appwrite infrastructure with industry-standard encryption in transit and at rest.",
      },
      {
        subtitle: "Payment security",
        text: "Payment details are processed by a secure gateway and never stored on our servers.",
      },
      {
        subtitle: "Retention",
        text: "We retain your data for as long as your account is active or as required by applicable law.",
      },
    ],
  },
  {
    icon: "share-social-outline",
    title: "Data Sharing",
    content: [
      {
        subtitle: "We do not sell your data",
        text: "Your personal information is never sold to third parties under any circumstances.",
      },
      {
        subtitle: "Service providers",
        text: "We share data only with Appwrite (database), Cloudinary (images), and Sentry (crash monitoring) — all bound by confidentiality agreements.",
      },
      {
        subtitle: "Legal requirements",
        text: "Data may be disclosed when required by law or to protect the safety of our users.",
      },
    ],
  },
  {
    icon: "person-outline",
    title: "Your Rights",
    content: [
      {
        subtitle: "Access & correction",
        text: "You can view and update your personal data at any time from your profile settings.",
      },
      {
        subtitle: "Deletion",
        text: "You may delete your account and all associated data via Profile > Account Settings > Delete Account.",
      },
      {
        subtitle: "Location consent",
        text: "Withdraw location access at any time through your device settings without affecting core app functionality.",
      },
    ],
  },
  {
    icon: "people-outline",
    title: "Children's Privacy",
    content: [
      {
        subtitle: "Age requirement",
        text: "Fumes is not intended for users under 13 years of age. We do not knowingly collect data from children.",
      },
    ],
  },
  {
    icon: "refresh-outline",
    title: "Policy Updates",
    content: [
      {
        subtitle: "How we notify you",
        text: "We will notify you of significant changes via in-app notification or email. Continued use after changes are posted constitutes acceptance.",
      },
    ],
  },
];

export default function PrivacyPolicy() {
  const insets = useSafeAreaInsets();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={DARK} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Privacy Policy</Text>
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
            <Ionicons name="shield-checkmark" size={32} color={ORANGE} />
          </View>
          <Text style={styles.heroTitle}>Your privacy matters</Text>
          <Text style={styles.heroSub}>
            We are committed to being transparent about how we handle your data.
            This policy explains everything clearly.
          </Text>
          <View style={styles.effectiveBadge}>
            <Text style={styles.effectiveText}>Effective April 2026 · Version 1.0</Text>
          </View>
        </View>

        {/* Sections */}
        <View style={styles.sectionsWrapper}>
          {sections.map((section, index) => {
            const isOpen = expandedIndex === index;
            return (
              <View key={index} style={styles.card}>
                <TouchableOpacity
                  style={styles.cardHeader}
                  onPress={() =>
                    setExpandedIndex(isOpen ? null : index)
                  }
                  activeOpacity={0.7}
                >
                  <View style={styles.cardHeaderLeft}>
                    <View
                      style={[
                        styles.cardIconWrap,
                        isOpen && { backgroundColor: ORANGE },
                      ]}
                    >
                      <Ionicons
                        name={section.icon as any}
                        size={18}
                        color={isOpen ? WHITE : ORANGE}
                      />
                    </View>
                    <Text style={styles.cardTitle}>{section.title}</Text>
                  </View>
                  <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={16}
                    color={GRAY}
                  />
                </TouchableOpacity>

                {isOpen && (
                  <View style={styles.cardBody}>
                    {section.content.map((item, i) => (
                      <View key={i} style={styles.contentItem}>
                        <View style={styles.contentDot} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.contentSubtitle}>
                            {item.subtitle}
                          </Text>
                          <Text style={styles.contentText}>{item.text}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Contact */}
        <View style={styles.contactCard}>
          <Ionicons name="mail-outline" size={20} color={ORANGE} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.contactTitle}>Questions about privacy?</Text>
            <Text style={styles.contactEmail}>privacy@fumes.app</Text>
          </View>
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
    paddingVertical: 32,
  },
  heroIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: ORANGE_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: DARK,
    marginBottom: 10,
    fontFamily:
      Platform.OS === "ios" ? "SF Pro Display" : "sans-serif-medium",
  },
  heroSub: {
    fontSize: 14,
    color: GRAY,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  effectiveBadge: {
    backgroundColor: ORANGE_LIGHT,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  effectiveText: {
    fontSize: 12,
    color: ORANGE,
    fontWeight: "600",
  },

  sectionsWrapper: { gap: 12, marginBottom: 20 },

  card: {
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: ORANGE_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: DARK,
    flex: 1,
  },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
    padding: 16,
    gap: 16,
  },
  contentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  contentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ORANGE,
    marginTop: 6,
  },
  contentSubtitle: {
    fontSize: 13,
    fontWeight: "700",
    color: DARK,
    marginBottom: 4,
  },
  contentText: {
    fontSize: 13,
    color: GRAY,
    lineHeight: 20,
  },

  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ORANGE_LIGHT,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  contactTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: DARK,
    marginBottom: 2,
  },
  contactEmail: {
    fontSize: 13,
    color: ORANGE,
    fontWeight: "600",
  },
});