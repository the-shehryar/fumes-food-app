import Colors from "@/constants/Colors";
import { AddressAppwrite } from "@/types/type";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

let { ORANGE, GRAY, GREEN, GREEN_LIGHT, GRAY_LIGHT, BORDER, ORANGE_LIGHT } =
  Colors;

const AddressCard = ({
  address,
  onRemove,
  index,
  onEdit,
}: {
  index: number;
  address: AddressAppwrite;
  onRemove: () => void;
  onEdit: () => void;
}) => {
  let [emoji, setEmoji] = useState("📌");

  useEffect(() => {
    if (address.tag.toLowerCase() === "home") {
      setEmoji("🏡");
    } else if (address.tag.toLowerCase() === "work") {
      setEmoji("🏢");
    } else {
      setEmoji("📌");
    }
  }, []);
  return (
    <View style={[styles.card, index === 0 ? styles.cardDefault : ""]}>
      <View style={styles.cardMainTextWrapper}>
        {index === 0 ? (
          <View style={styles.defaultbadge}>
            <Text style={{ color: GREEN, fontSize: 12 }}>Default</Text>
          </View>
        ) : (
          ""
        )}
        <Text style={styles.label}>{emoji}</Text>
        <Text style={styles.label}>{address.address}</Text>
      </View>
      <Text style={styles.street}>{address.city}</Text>
      {/* <Ionicons size={18} name={address.icon as any} color={ORANGE} /> */}
      <View style={styles.actionBtnsWrapper}>
        <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
          <Text>Edit address</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={onRemove}>
          <Text style={{color : "#df2424"}}>Delete address</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddressCard;

const styles = StyleSheet.create({
  card: {
    // padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: "90%",
    elevation: 10,
    padding: 20,
    backgroundColor: "#fafafa",
  },
  cardDefault: {
    borderWidth: 1,
    borderColor: ORANGE,
  },
  actionBtnsWrapper: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 8,
  },
  editBtn: {
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: BORDER,
    borderWidth: 2,
    height: 44,
    marginHorizontal: 4,
  },
  deleteBtn: {
    width: "40%",
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: BORDER,
    borderWidth: 2,
    height: 44,
    // backgroundColor :"#f5191929"
  },
  cardMainTextWrapper: {
    // backgroundColor  : 'red',
    flexDirection: "column",
  },
  defaultbadge: {
    width: 80,
    // width: "auto",
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GREEN_LIGHT,
    // borderColor: ,
    // borderWidth: 1,
    // borderRadius: 4,
  },
  label: {
    // alignSelf : 'center',
    fontWeight: "700",
    fontSize: 18,
    marginRight: 8,
  },
  street: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
});
