import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type ExtraItem = {
  id: string;
  icon: string;
  name: string;
  price: number;
  type?: string;
};
type ExtraRowProps = {
  item: ExtraItem;
  checked: boolean;
  onToggle: () => void;
};

const ORANGE = "#F97316";
const ORANGE_LIGHT = "#FFF4EE";
const DARK = "#1A1A1A";
const GRAY = "#9CA3AF";
const GRAY_LIGHT = "#F5F5F5";
const WHITE = "#FFFFFF";
const BORDER = "#F0F0F0";
const GREEN = "#16A34A";
const GREEN_LIGHT = "#F0FDF4";

// ─── Extra Item Row ───────────────────────────────────────────────────────────
export default function ExtraRow({ item, checked, onToggle }: ExtraRowProps) {
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
        <Text style={styles.extraLabel}>{item.name}</Text>
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

let styles = StyleSheet.create({
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
});
