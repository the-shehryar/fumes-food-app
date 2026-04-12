import { account } from "@/libs/appwrite";
import useAuthStore from "@/stores/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
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
const RED = "#EF4444";
const GREEN = "#16A34A";
const GREEN_LIGHT = "#F0FDF4";

const COUNTRIES = [
  { code: "+92", name: "Pakistan", flag: "🇵🇰", iso: "PK" },
  { code: "+1", name: "United States", flag: "🇺🇸", iso: "US" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧", iso: "GB" },
  { code: "+91", name: "India", flag: "🇮🇳", iso: "IN" },
  { code: "+971", name: "UAE", flag: "🇦🇪", iso: "AE" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦", iso: "SA" },
  { code: "+974", name: "Qatar", flag: "🇶🇦", iso: "QA" },
  { code: "+965", name: "Kuwait", flag: "🇰🇼", iso: "KW" },
  { code: "+973", name: "Bahrain", flag: "🇧🇭", iso: "BH" },
  { code: "+968", name: "Oman", flag: "🇴🇲", iso: "OM" },
  { code: "+49", name: "Germany", flag: "🇩🇪", iso: "DE" },
  { code: "+33", name: "France", flag: "🇫🇷", iso: "FR" },
  { code: "+39", name: "Italy", flag: "🇮🇹", iso: "IT" },
  { code: "+34", name: "Spain", flag: "🇪🇸", iso: "ES" },
  { code: "+7", name: "Russia", flag: "🇷🇺", iso: "RU" },
  { code: "+86", name: "China", flag: "🇨🇳", iso: "CN" },
  { code: "+81", name: "Japan", flag: "🇯🇵", iso: "JP" },
  { code: "+82", name: "South Korea", flag: "🇰🇷", iso: "KR" },
  { code: "+55", name: "Brazil", flag: "🇧🇷", iso: "BR" },
  { code: "+61", name: "Australia", flag: "🇦🇺", iso: "AU" },
  { code: "+1", name: "Canada", flag: "🇨🇦", iso: "CA" },
  { code: "+20", name: "Egypt", flag: "🇪🇬", iso: "EG" },
  { code: "+234", name: "Nigeria", flag: "🇳🇬", iso: "NG" },
  { code: "+27", name: "South Africa", flag: "🇿🇦", iso: "ZA" },
  { code: "+62", name: "Indonesia", flag: "🇮🇩", iso: "ID" },
  { code: "+60", name: "Malaysia", flag: "🇲🇾", iso: "MY" },
  { code: "+63", name: "Philippines", flag: "🇵🇭", iso: "PH" },
  { code: "+66", name: "Thailand", flag: "🇹🇭", iso: "TH" },
  { code: "+880", name: "Bangladesh", flag: "🇧🇩", iso: "BD" },
  { code: "+94", name: "Sri Lanka", flag: "🇱🇰", iso: "LK" },
  { code: "+90", name: "Turkey", flag: "🇹🇷", iso: "TR" },
  { code: "+98", name: "Iran", flag: "🇮🇷", iso: "IR" },
  { code: "+964", name: "Iraq", flag: "🇮🇶", iso: "IQ" },
  { code: "+962", name: "Jordan", flag: "🇯🇴", iso: "JO" },
  { code: "+961", name: "Lebanon", flag: "🇱🇧", iso: "LB" },
];

type Country = (typeof COUNTRIES)[number];

function CountryPickerModal({
  visible,
  onClose,
  onSelect,
  selected,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: Country) => void;
  selected: Country;
}) {
  const [search, setSearch] = useState("");
  const insets = useSafeAreaInsets();

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search),
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={pickerStyles.overlay}>
        <TouchableOpacity style={pickerStyles.backdrop} onPress={onClose} />
        <View
          style={[pickerStyles.sheet, { paddingBottom: insets.bottom + 16 }]}
        >
          <View style={pickerStyles.handle} />
          <View style={pickerStyles.header}>
            <Text style={pickerStyles.title}>Select Country</Text>
            <TouchableOpacity onPress={onClose} style={pickerStyles.closeBtn}>
              <Ionicons name="close" size={18} color={DARK} />
            </TouchableOpacity>
          </View>
          <View style={pickerStyles.searchWrap}>
            <Ionicons
              name="search-outline"
              size={16}
              color={GRAY}
              style={{ marginRight: 8 }}
            />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search country or code..."
              placeholderTextColor={GRAY}
              style={pickerStyles.searchInput}
              autoFocus
            />
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.iso}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = item.iso === selected.iso;
              return (
                <TouchableOpacity
                  style={[
                    pickerStyles.countryRow,
                    isSelected && pickerStyles.countryRowSelected,
                  ]}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={pickerStyles.flag}>{item.flag}</Text>
                  <Text style={pickerStyles.countryName}>{item.name}</Text>
                  <Text
                    style={[
                      pickerStyles.countryCode,
                      isSelected && { color: ORANGE },
                    ]}
                  >
                    {item.code}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={ORANGE}
                      style={{ marginLeft: 4 }}
                    />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

function PhoneInput({
  value,
  onChange,
  country,
  onCountryChange,
  editable,
}: {
  value: string;
  onChange: (v: string) => void;
  country: Country;
  onCountryChange: (c: Country) => void;
  editable: boolean;
}) {
  const [pickerVisible, setPickerVisible] = useState(false);

  return (
    <>
      <CountryPickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={onCountryChange}
        selected={country}
      />
      <View
        style={[
          phoneStyles.wrapper,
          !editable && phoneStyles.wrapperDisabled,
        ]}
      >
        <TouchableOpacity
          style={phoneStyles.countryBtn}
          onPress={() => editable && setPickerVisible(true)}
          activeOpacity={editable ? 0.7 : 1}
        >
          <Text style={phoneStyles.flag}>{country.flag}</Text>
          <Text style={phoneStyles.code}>{country.code}</Text>
          {editable && (
            <Ionicons name="chevron-down" size={12} color={GRAY} style={{ marginLeft: 2 }} />
          )}
        </TouchableOpacity>
        <View style={phoneStyles.divider} />
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="300 1234567"
          placeholderTextColor={GRAY}
          keyboardType="phone-pad"
          editable={editable}
          style={[phoneStyles.input, !editable && { color: GRAY }]}
        />
      </View>
    </>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  editable: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "numeric";
  autoCapitalize?: "none" | "words" | "sentences";
};

function Field({
  label,
  value,
  onChange,
  editable,
  icon,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "words",
}: FieldProps) {
  return (
    <View style={fieldStyles.wrapper}>
      <Text style={fieldStyles.label}>{label}</Text>
      <View
        style={[
          fieldStyles.inputWrap,
          editable && fieldStyles.inputWrapActive,
        ]}
      >
        <Ionicons
          name={icon}
          size={16}
          color={editable ? ORANGE : GRAY}
          style={{ marginRight: 10 }}
        />
        <TextInput
          value={value}
          onChangeText={onChange}
          editable={editable}
          placeholder={placeholder ?? label}
          placeholderTextColor={GRAY}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={[fieldStyles.input, !editable && { color: GRAY }]}
        />
      </View>
    </View>
  );
}

export default function PersonalInfo() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);

  const [originalName, setOriginalName] = useState(name);
  const [originalPhone, setOriginalPhone] = useState(phone);
  const [originalBirthday, setOriginalBirthday] = useState(birthday);
  const [originalCountry, setOriginalCountry] = useState<Country>(COUNTRIES[0]);

  function handleEdit() {
    setOriginalName(name);
    setOriginalPhone(phone);
    setOriginalBirthday(birthday);
    setOriginalCountry(country);
    setEditing(true);
    setSavedOk(false);
  }

  function handleCancel() {
    setName(originalName);
    setPhone(originalPhone);
    setBirthday(originalBirthday);
    setCountry(originalCountry);
    setEditing(false);
  }

  async function handleSave() {
    try {
      setSaving(true);
      await account.updateName({ name });
      useAuthStore.getState().fetchAuthenticatedUser();
      setSavedOk(true);
      setEditing(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  }

  const hasChanges =
    name !== originalName ||
    phone !== originalPhone ||
    birthday !== originalBirthday ||
    country.iso !== originalCountry.iso;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.root}>
        <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

        <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => (editing ? handleCancel() : router.back())}
          >
            <Ionicons
              name={editing ? "close" : "chevron-back"}
              size={22}
              color={DARK}
            />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Personal Info</Text>
          <TouchableOpacity
            style={[
              styles.iconBtn,
              editing && { backgroundColor: ORANGE_LIGHT },
            ]}
            onPress={editing ? handleSave : handleEdit}
            disabled={saving || (editing && !hasChanges)}
          >
            {saving ? (
              <ActivityIndicator size="small" color={ORANGE} />
            ) : (
              <Ionicons
                name={editing ? "checkmark" : "pencil-outline"}
                size={20}
                color={editing ? ORANGE : DARK}
              />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: insets.bottom + 40 },
          ]}
        >
          <View style={styles.avatarSection}>
            <View style={styles.avatarOuter}>
              <Image
                source={{ uri: "https://i.pravatar.cc/150?img=11" }}
                style={styles.avatar}
              />
              {editing && (
                <TouchableOpacity style={styles.cameraBadge}>
                  <Ionicons name="camera" size={13} color={WHITE} />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.avatarName}>{name || "Your Name"}</Text>
            <Text style={styles.avatarEmail}>{email}</Text>

            {savedOk && (
              <View style={styles.savedBadge}>
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={GREEN}
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.savedText}>Profile updated</Text>
              </View>
            )}
          </View>

          {editing && (
            <View style={styles.editingBanner}>
              <Ionicons
                name="create-outline"
                size={14}
                color={ORANGE}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.editingBannerText}>
                Editing mode — tap ✓ to save
              </Text>
            </View>
          )}

          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>Basic Information</Text>
            <View style={styles.card}>
              <Field
                label="Full Name"
                value={name}
                onChange={setName}
                editable={editing}
                icon="person-outline"
                placeholder="Enter your full name"
              />
              <View style={styles.divider} />
              <Field
                label="Email Address"
                value={email}
                onChange={setEmail}
                editable={false}
                icon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.divider} />
              <Field
                label="Date of Birth"
                value={birthday}
                onChange={setBirthday}
                editable={editing}
                icon="calendar-outline"
                placeholder="DD / MM / YYYY"
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>Contact</Text>
            <View style={styles.card}>
              <View style={{ padding: 16 }}>
                <Text style={fieldStyles.label}>Phone Number</Text>
                <PhoneInput
                  value={phone}
                  onChange={setPhone}
                  country={country}
                  onCountryChange={setCountry}
                  editable={editing}
                />
              </View>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>Account</Text>
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <View style={styles.infoIconWrap}>
                  <Ionicons name="shield-checkmark-outline" size={16} color={GREEN} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoRowLabel}>Email verified</Text>
                  <Text style={styles.infoRowSub}>Your email is confirmed</Text>
                </View>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <View style={styles.infoIconWrap}>
                  <Ionicons name="time-outline" size={16} color={GRAY} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoRowLabel}>Member since</Text>
                  <Text style={styles.infoRowSub}>
                    {user?.$createdAt
                      ? new Date(user.$createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })
                      : "—"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {editing && (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={handleCancel}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.saveBtn,
                  (!hasChanges || saving) && styles.saveBtnDisabled,
                ]}
                onPress={handleSave}
                disabled={!hasChanges || saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={WHITE} />
                ) : (
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "sans-serif-medium",
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 28,
  },
  avatarOuter: {
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: ORANGE,
  },
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
  avatarName: {
    fontSize: 20,
    fontWeight: "700",
    color: DARK,
    marginBottom: 4,
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "sans-serif-medium",
  },
  avatarEmail: {
    fontSize: 13,
    color: GRAY,
  },
  savedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GREEN_LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },
  savedText: {
    fontSize: 12,
    color: GREEN,
    fontWeight: "600",
  },
  editingBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ORANGE_LIGHT,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
  },
  editingBannerText: {
    fontSize: 13,
    color: ORANGE,
    fontWeight: "600",
  },
  formSection: {
    marginBottom: 20,
  },
  sectionLabel: {
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
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginHorizontal: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  infoIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: GRAY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  infoRowLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: DARK,
  },
  infoRowSub: {
    fontSize: 12,
    color: GRAY,
    marginTop: 2,
  },
  verifiedBadge: {
    backgroundColor: GREEN_LIGHT,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: "700",
    color: GREEN,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: GRAY,
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: ORANGE,
    alignItems: "center",
    elevation: 4,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveBtnDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: WHITE,
  },
});

const fieldStyles = StyleSheet.create({
  wrapper: {
    padding: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: GRAY,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GRAY_LIGHT,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  inputWrapActive: {
    backgroundColor: ORANGE_LIGHT,
    borderColor: ORANGE,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: DARK,
    fontWeight: "500",
  },
});

const phoneStyles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GRAY_LIGHT,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
    overflow: "hidden",
  },
  wrapperDisabled: {
    borderColor: "transparent",
  },
  countryBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 13,
    gap: 4,
  },
  flag: {
    fontSize: 18,
  },
  code: {
    fontSize: 14,
    fontWeight: "700",
    color: DARK,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: BORDER,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: DARK,
    paddingHorizontal: 12,
    paddingVertical: 13,
    fontWeight: "500",
  },
});

const pickerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sheet: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: "80%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: BORDER,
    alignSelf: "center",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: DARK,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: GRAY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GRAY_LIGHT,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: DARK,
  },
  countryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    gap: 10,
  },
  countryRowSelected: {
    backgroundColor: ORANGE_LIGHT,
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  flag: {
    fontSize: 22,
  },
  countryName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: DARK,
  },
  countryCode: {
    fontSize: 13,
    fontWeight: "700",
    color: GRAY,
  },
});