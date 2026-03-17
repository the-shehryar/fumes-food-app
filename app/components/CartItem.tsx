import { useCartStore } from "@/stores/cart.store";
import { CartCustomization, CartItemType } from "@/type";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
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
const RED = "#EF4444";
const RED_LIGHT = "#FFF1F2";

const { width } = Dimensions.get("window");

const SIZES = ["S", "M", "Regular", "L", "XL"];

//* Older Approach
// export default function CartItem({ item }: { item: CartItemType }) {
//   let { increaseQty, decreaseQty } = useCartStore();

//   const handleIncreaseQty = () => {
//     increaseQty(
//       item.id,
//       [], // You can add default customizations if needed
//     );
//   };
//   const handleDecreaseQty = () => {
//     decreaseQty(
//       item.id,
//       [], // You can add default customizations if needed
//     );
//   };

//   return (
//     <View style={cartItemStyles.wrapper}>
//       <View style={cartItemStyles.imageWrapper}>
//         <Image source={images.coffeeOffer} style={cartItemStyles.image} />
//       </View>
//       <View style={cartItemStyles.contentWrapper}>
//         <Text
//           numberOfLines={2}
//           ellipsizeMode="tail"
//           style={cartItemStyles.name}
//         >
//           {item.name}
//         </Text>
//         {item.size ? (
//           <View style={cartItemStyles.sizeWrapper}>
//             <Text style={cartItemStyles.size}>Size :</Text>
//             <Text style={cartItemStyles.sizeText}>{item.size}</Text>
//           </View>
//         ) : (
//           ""
//         )}
//         <View style={cartItemStyles.priceWrapper}>
//           <View style={quantityStyles.buttonsWrapper}>
//             <TouchableOpacity
//               onPress={handleDecreaseQty}
//               style={quantityStyles.button}
//             >
//               <SubstractBtn width={24} height={24} />
//             </TouchableOpacity>
//             <View style={quantityStyles.itemCountWrapper}>
//               <Text style={quantityStyles.itemCount}>{item.quantity}</Text>
//             </View>
//             <TouchableOpacity
//               onPress={handleIncreaseQty}
//               style={quantityStyles.button}
//             >
//               <AddButton width={24} height={24} />
//             </TouchableOpacity>
//           </View>

//           <Text style={cartItemStyles.price}>${item.price}</Text>
//         </View>
//       </View>
//     </View>
//   );
// }

// const cartItemStyles = StyleSheet.create({
//   wrapper: {
//     width: "94%",
//     flexDirection: "row",
//     paddingVertical: 10,
//     paddingBottom: 20,
//     paddingHorizontal: 4,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//     alignItems: "center",
//     alignSelf: "center",
//   },
//   imageWrapper: {
//     width: 120,
//     height: 120,
//     marginRight: 10,
//     borderRadius: 16,
//     overflow: "hidden",
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//   },
//   contentWrapper: {
//     flex: 1,
//     justifyContent: "space-between",
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   price: {
//     fontSize: 20,
//     fontWeight: 600,
//     color: "#3C3A45",
//   },
//   quantity: {
//     fontSize: 14,
//     color: "#888",
//   },
//   sizeWrapper: {
//     maxWidth: 120,
//     minWidth: 60,
//     height: 30,
//     flexDirection: "row",
//     alignItems: "center",
//     // backgroundColor : "green"
//   },
//   size: {
//     fontSize: 14,
//     color: "#888",
//   },
//   sizeText: {
//     color: "#FF611D",
//     fontSize: 14,
//     textTransform: "capitalize",
//     marginLeft: 4,
//   },
//   priceWrapper: {
//     height: 50,
//     borderRadius: 8,
//     paddingRight: 10,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
// });

// const quantityStyles = StyleSheet.create({
//   buttonsWrapper: {
//     width: "40%",
//     height: "100%",
//     flexDirection: "row",
//     justifyContent: "flex-start",
//     alignItems: "center",
//   },
//   button: {
//     width: "auto",
//     height: "auto",
//     marginHorizontal: 8,
//     // backgroundColor: "#10cf90",
//   },
//   itemCountWrapper: {
//     maxWidth: 24,
//     height: 24,
//     justifyContent: "center",
//     alignItems: "center",
//     // backgroundColor  : "red",
//   },
//   itemCount: {
//     fontSize: 16,
//     fontWeight: 600,
//   },
// });

const CartItem: React.FC<{
  item: CartItemType;
  index: number;
  // onRemove: (id: string) => void;
  // onCheckToggle?: (id: string) => void;
  // onSizeChange: (id: string, size: string) => void;
}> = ({ item, index }) => {
  let { increaseQty, decreaseQty, removeItem } = useCartStore();
  const [showSizes, setShowSizes] = useState(false);
  const [itemSize, setItemSize] = useState<string>('regular')
  const slideAnim = useRef(new Animated.Value(30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const removeAnim = useRef(new Animated.Value(1)).current;

  const [visible, setVisible] = useState<boolean>(false)



  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 380,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 380,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleIncrease = (id: string, customizations: CartCustomization[]) => {
    increaseQty(item.id, item.customizations);
  };
  const handleDecrease = (id: string, customizations: CartCustomization[]) => {
    decreaseQty(item.id, item.customizations);
  };

  const handleRemove = () => {
    Animated.parallel([
      Animated.timing(removeAnim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start(() => removeItem(item.id, item.customizations));
  };

  useFocusEffect(
    useCallback(() => {
      // reset values before replaying
      slideAnim.setValue(50);
      opacityAnim.setValue(0);

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 380,
          delay: index * 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 380,
          delay: index * 80,
          useNativeDriver: true,
        }),
      ]).start();
    }, []),
  );

  return (
    <Animated.View
      style={[
        styles.cartItemWrap,
        {
          opacity: Animated.multiply(opacityAnim, removeAnim),
          transform: [
            { translateX: slideAnim },
            {
              scale: removeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.cartItem}>
        {/* Checkbox */}
        <TouchableOpacity
          style={styles.checkbox}
          // onPress={() => onCheckToggle(item.id)}
        >
          <View
            style={[
              styles.checkboxInner,
              // item.checked && styles.checkboxChecked,
            ]}
          >
            {/* {item.checked && (
              <Ionicons name="checkmark" size={13} color={WHITE} />
            )} */}
          </View>
        </TouchableOpacity>

        {/* Image */}
        <Image source={{ uri: item.image_url }} style={styles.cartItemImg} />

        {/* Info */}
        <View style={styles.cartItemInfo}>
          <View style={styles.cartItemTopRow}>
            <Text style={styles.cartItemName} numberOfLines={2}>
              {item.name}
            </Text>
            <TouchableOpacity onPress={handleRemove} style={styles.removeBtn}>
              <Ionicons name="close" size={16} color={GRAY} />
            </TouchableOpacity>
          </View>

          {/* Size selector */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={styles.sizeChip}
              onPress={() => setShowSizes(!showSizes)}
            >
              <Text style={styles.sizeChipLabel}>Size : </Text>
              <Text style={styles.sizeChipValue}>{itemSize.charAt(0).toUpperCase() + itemSize.slice(1)}</Text>
              <Ionicons
                name="chevron-down"
                size={12}
                color={ORANGE}
                style={{ marginLeft: 2 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.customizationChip}
              onPress={() => setVisible(!visible)}
            >
              <Text style={styles.sizeChipLabel}>Customizations</Text>
              <Ionicons
                name="add"
                size={12}
                color={ORANGE}
                style={{ marginLeft: 2 }}
              />
            </TouchableOpacity>
          </View>

          {showSizes && (
            <View style={styles.sizesDropdown}>
              {SIZES.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.sizeOption,
                    itemSize.toLowerCase() === s.toLowerCase() && styles.sizeOptionActive,
                  ]}
                  onPress={() => {
                    setItemSize(s)
                    setShowSizes(false);
                  }}
                >
                  <Text
                    style={[
                      styles.sizeOptionText,
                      item.size === s && styles.sizeOptionTextActive,
                    ]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {
            <Modal
              visible={visible}
              transparent // ✅ keeps background visible
              animationType="fade" // "slide" | "fade" | "none"
              onRequestClose={() => setVisible(false)}
            >
              {/* dark overlay */}
              <View style={styles.overlay}>
                {/* popup box */}
                <View style={styles.popup}>
                  <Text style={styles.title}>Please Add Customizations Here🔥</Text>
                  <Text style={styles.message}>Your food is on the way.</Text>
                  <TouchableOpacity
                    onPress={() => setVisible(false)}
                    style={styles.btn}
                  >
                    <Text style={styles.btnText}>Got it</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          }
          {/* Qty + Price */}
          <View style={styles.cartItemBottomRow}>
            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => handleDecrease(item.id, item.customizations)}
              >
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyNum}>{item.quantity}</Text>
              <TouchableOpacity
                style={[styles.qtyBtn, styles.qtyBtnFill]}
                onPress={() => handleIncrease(item.id, item.customizations)}
              >
                <Text style={[styles.qtyBtnText, { color: WHITE }]}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.cartItemPrice}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  cartItemWrap: {
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 2,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cartItem: { flexDirection: "row", alignItems: "flex-start", padding: 14 },
  checkbox: { marginRight: 10, marginTop: 4 },
  checkboxInner: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: ORANGE, borderColor: ORANGE },
  cartItemImg: { width: 80, height: 80, borderRadius: 14, marginRight: 12 },
  cartItemInfo: { flex: 1 },
  cartItemTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  cartItemName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: DARK,
    lineHeight: 19,
    paddingRight: 8,
  },
  removeBtn: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: GRAY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },

  // Size
  sizeChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: ORANGE_LIGHT,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginBottom: 10,
  },
  customizationChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: GRAY_LIGHT,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginBottom: 10,
  },
  sizeChipLabel: { fontSize: 12, color: GRAY },
  sizeChipValue: { fontSize: 12, fontWeight: "700", color: ORANGE },
  sizesDropdown: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
    gap: 6,
  },
  sizeOption: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: GRAY_LIGHT,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  sizeOptionActive: { backgroundColor: ORANGE_LIGHT, borderColor: ORANGE },
  sizeOptionText: { fontSize: 12, color: GRAY, fontWeight: "600" },
  sizeOptionTextActive: { color: ORANGE },

  // Qty
  cartItemBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  qtyRow: { flexDirection: "row", alignItems: "center" },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnFill: { backgroundColor: DARK, borderColor: DARK },
  qtyBtnText: { fontSize: 15, fontWeight: "700", color: DARK },
  qtyNum: {
    fontSize: 15,
    fontWeight: "700",
    color: DARK,
    marginHorizontal: 10,
    minWidth: 18,
    textAlign: "center",
  },
  cartItemPrice: { fontSize: 17, fontWeight: "800", color: DARK },




// Popup Modal Styles

  overlay: {
    flex: 1,
    backgroundColor: "#00000080",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 10,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  message: { fontSize: 14, color: "#6e6e72", marginBottom: 20 },
  btn: {
    backgroundColor: "#FF611D",
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
});
