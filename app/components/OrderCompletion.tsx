import CompletionSvg from "@/assets/images/verified-symbol-icon.svg";
import React, { useEffect } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ID } from "react-native-appwrite";

const ORANGE = "#F97316";
const ORANGE_LIGHT = "#FFF4EE";
const DARK = "#1A1A1A";
const GRAY = "#9CA3AF";
const GRAY_LIGHT = "#F5F5F5";
const WHITE = "#FFFFFF";
const BORDER = "#F0F0F0";
const GREEN = "#10a64a";
const GREEN_LIGHT = "#F0FDF4";

const TAGS = [
  { label: "Home", icon: "home" },
  { label: "Work", icon: "briefcase" },
  { label: "Other", icon: "loaction-sharp" },
];

interface AddAddressModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function OrderCompletion({
  visible,
  onClose,
  onSave,
}: AddAddressModalProps) {
  const handleClose = () => {
    onClose();
  };
  const handleRedirect = () => {
    onSave();
  };
  useEffect(() => {}, []);

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
              <Text style={styles.title}>{}</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: "100%",
                height: 160,
                flex: 1,
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <CompletionSvg width={120} height={120} fill={ORANGE} />
            </View>

            {/* <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or enter manually</Text>
              <View style={styles.dividerLine} />
            </View> */}
            <View style={styles.sucessTextWrapper}>
              <Text style={styles.sucessText}>Order was placed successfully</Text>
            </View>
            <View style={styles.orderIDWrapper}>
              <Text style ={styles.orderIdText}>Your Order ID :</Text>
              <Text style ={styles.orderId}>{ID.unique()}</Text>
            </View>

            {/* Save Button */}
            <TouchableOpacity style={[styles.saveBtn]} onPress={handleRedirect}>
              <Text style={styles.saveBtnText}>Back to Home</Text>
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
  sucessTextWrapper: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    alignItems : 'center'
  },
  sucessText: {
    fontSize : 24,
    fontWeight : 700,
    color: "#111",
  },
  orderIDWrapper: {
    width : '100%',
    justifyContent : "center",
    alignItems : "center",
    marginVertical : 20
  },
  orderIdText : {
    fontSize : 16,
    fontWeight: 400,
    color : "#444"
  },
  orderId : {
    fontSize : 16,
    fontWeight: 400,
    color : "#444"
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
