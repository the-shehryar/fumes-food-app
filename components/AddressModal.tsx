import { requestLocationPermission } from "@/libs/helpers";
import useAuthStore from "@/stores/auth.store";
import { Address, AddressAppwrite } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ORANGE = "#F97316";
const ORANGE_LIGHT = "#FFF4EE";
const DARK = "#1A1A1A";
const GRAY = "#9CA3AF";
const GRAY_LIGHT = "#F5F5F5";
const WHITE = "#FFFFFF";
const BORDER = "#F0F0F0";
const GREEN = "#16A34A";
const GREEN_LIGHT = "#F0FDF4";

const TAGS = [
  { label: "Home", icon: "home" },
  { label: "Work", icon: "briefcase" },
  { label: "Other", icon: "loaction-sharp" },
];

interface AddAddressModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (address: Address) => void;
  onUpdate?: (address: Address) => void;
  action?: "update" | "create";
  target?: AddressAppwrite | undefined;
}

export default function NewAddressModal({
  visible,
  onClose,
  onSave,
  onUpdate,
  action = "create",
  target,
}: AddAddressModalProps) {
  let [modalTitle, setModalTitle] = useState("Add New Address");
  let [actionBtn, setActionBtn] = useState("Save Address");
  const [selectedTag, setSelectedTag] = useState(TAGS[0]);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [detecting, setDetecting] = useState(false);

  const { user } = useAuthStore();

  const handleDetectLocation = async () => {
    // Detect location using Geolocation API
    let locationPermission = await requestLocationPermission();
    if (locationPermission?.street && locationPermission?.city) {
      setStreet(locationPermission.street);
      setCity(locationPermission.city);
      setDetecting(true);
    }
  };

  const handleSave = async () => {
    if (!street.trim() || !city.trim()) return;

    if (user && action === "create") {
      const newAddress: Address = {
        userId: user?.$id,
        tag: selectedTag.label,
        icon: selectedTag.icon,
        address: street.trim(),
        city: city.trim(),
      };
      try {
        onSave(newAddress);
      } catch (error) {
        console.log(error);
      } finally {
        handleClose();
      }
    } else if (user && action === "update") {
      // get the address and update the main address
      const newAddress: Address = {
        userId: user?.$id,
        tag: selectedTag.label,
        icon: selectedTag.icon,
        address: street.trim(),
        city: city.trim(),
      };
      try {
        onUpdate?.(newAddress);
      } catch (error) {
        console.log(error);
      } finally {
        handleClose();
      }
    }

    // handleClose();
  };

  const handleClose = () => {
    setStreet("");
    setCity("");
    setSelectedTag(TAGS[0]);
    onClose();
  };

  const isValid = street.trim().length > 0 && city.trim().length > 0;

  useEffect(() => {
    if (!detecting) return;
    const timer = setTimeout(() => setDetecting(false), 2000);
    return () => clearTimeout(timer);
  }, [detecting]);

  useEffect(() => {
    if (action === "update") {
      setModalTitle("Update Address");
      console.log(target);
      if (target !== undefined) {
        setCity(target.city);
        setStreet(target.address);
        setActionBtn("Update Address");
        console.log(target);
      }
    }
  }, [target, action, modalTitle]);
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity style={styles.backdrop} onPress={handleClose} />

        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{modalTitle}</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Auto Detect */}
            <TouchableOpacity
              style={[
                styles.detectBtn,
                detecting && { backgroundColor: ORANGE_LIGHT },
              ]}
              onPress={handleDetectLocation}
              disabled={detecting}
            >
              {detecting ? (
                <ActivityIndicator color={DARK} size="small" />
              ) : (
                <Ionicons name="location-sharp" size={20} color="#fff" />
                // <Text style={styles.detectIcon}>📡</Text>
              )}
              <Text style={[styles.detectText, detecting && { color: DARK }]}>
                {detecting ? "Detecting location..." : "Detect My Location"}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or enter manually</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Tag Selector */}
            <Text style={styles.label}>Address Tag</Text>
            <View style={styles.tagRow}>
              {TAGS.map((tag) => (
                <TouchableOpacity
                  key={tag.label}
                  style={[
                    styles.tagChip,
                    selectedTag.label === tag.label && styles.tagChipActive,
                  ]}
                  onPress={() => setSelectedTag(tag)}
                >
                  {/* <Text style={styles.tagIcon}>{tag.icon}</Text> */}
                  <Text
                    style={[
                      styles.tagLabel,
                      selectedTag.label === tag.label && styles.tagLabelActive,
                    ]}
                  >
                    {tag.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Street Input */}
            <Text style={styles.label}>Street Address</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. House 5, Street 10"
              placeholderTextColor="#aaa"
              value={street}
              onChangeText={setStreet}
            />

            {/* City Input */}
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Islamabad"
              placeholderTextColor="#aaa"
              value={city}
              onChangeText={setCity}
            />

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveBtn, !isValid && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={!isValid}
            >
              <Text style={styles.saveBtnText}>{actionBtn}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
    maxHeight: "90%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ddd",
    alignSelf: "center",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 14,
    color: "#555",
  },
  detectBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ORANGE,
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
    marginBottom: 20,
  },
  detectIcon: {
    fontSize: 18,
  },
  detectText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#eee",
  },
  dividerText: {
    fontSize: 12,
    color: "#aaa",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "GRAY",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tagRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  tagChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e5e5e5",
    backgroundColor: "#fafafa",
  },
  tagChipActive: {
    borderColor: ORANGE,
    backgroundColor: ORANGE,
  },
  tagIcon: {
    fontSize: 16,
  },
  tagLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
  tagLabelActive: {
    color: "#fff",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: "#111",
    marginBottom: 16,
    backgroundColor: "#fafafa",
  },
  saveBtn: {
    backgroundColor: "#111",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  saveBtnDisabled: {
    backgroundColor: "#ccc",
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
