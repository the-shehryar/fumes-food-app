import { ItemSize } from "@/types/type";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ORANGE = "#F97316";
const DARK = "#1A1A1A";
const GRAY = "#9CA3AF";
const BORDER = "#E5E7EB";
const WHITE = "#FFFFFF";

type SizeSelectorProps = {
  sizes?: ItemSize[] | [{ name: "medium" }, { name: "small" }];
  selected: string;
  onSelect: (size: string) => void;
  label?: boolean;
};

export default function SizeSelector({
  sizes,
  selected,
  onSelect,
  label = true,
}: SizeSelectorProps) {
  let hardCodedSizes = [
    {
      name: "small",
    },
    {
      name: "medium",
    },
    {
      name: "large",
    },
    {
      name: "extra-large",
    },
    {
      name: "half",
    },
  ];
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>Sizes</Text>}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {hardCodedSizes.map((size) => {
          const isActive = selected === size.name;
          return (
            <TouchableOpacity
              key={size.name}
              onPress={() => onSelect(size.name)}
              activeOpacity={0.75}
              style={[
                styles.chip,
                isActive ? styles.chipActive : styles.chipInactive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  isActive ? styles.chipTextActive : styles.chipTextInactive,
                ]}
              >
                {size.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
    gap: 16,
    paddingTop: 60,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    gap: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: DARK,
  },
  cardPrice: {
    fontSize: 13,
    color: ORANGE,
    fontWeight: "600",
    marginBottom: 10,
  },

  // ── Size Selector ──
  wrapper: { gap: 8 },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: GRAY,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  row: { flexDirection: "row", gap: 8, paddingVertical: 2 },

  chip: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 50,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  chipInactive: {
    backgroundColor: WHITE,
    borderColor: BORDER,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  chipTextActive: {
    color: WHITE,
  },
  chipTextInactive: {
    color: DARK,
  },

  output: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  outputText: {
    fontSize: 13,
    color: GRAY,
  },
});
