import Colors from "@/constants/Colors";
import { CartItemType, Order } from "@/types/type";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

let { ORANGE, GRAY, GREEN, GREEN_LIGHT, GRAY_LIGHT, BORDER, ORANGE_LIGHT } =
  Colors;

const OrderCard = ({
  order,
  onCancel,
}: {
  order: Order;
  onCancel: () => void;
}) => {
  let [orderStatus, setOrderStatus] = useState("pending");
  let [orderItems, setOrderItems] = useState<CartItemType[] | undefined>(undefined);


  function parseOrderItems (data : string){
    return JSON.parse(data) as Order[]
  }

  useEffect(() => {
    if (order) {
      setOrderStatus(order.status.toLowerCase());
      let items = parseOrderItems(order.items);
      setOrderItems(items as unknown as CartItemType[]);
    }
    console.log(orderItems, null, 2 )
  }, []);
  return (
    <View style={[styles.card, order.status ? styles.cardDefault : ""]}>
      <View style={styles.cardMainTextWrapper}>
        <View style={styles.defaultbadge}>
          <Text style={{ color: GREEN, fontSize: 12 }}>{orderStatus}</Text>
        </View>
        <Text style={styles.label}>{order.$id}</Text>
        <Text style={styles.label}>{order.address}</Text>
      </View>

      {orderItems?.map((item) => (
        <Text key={item.id} style={styles.street}>{item.name}</Text>
      ))}
      {/* <Ionicons size={18} name={address.icon as any} color={ORANGE} /> */}
      <View style={styles.actionBtnsWrapper}>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => {}}>
          <Text style={{ color: "#df2424" }}>Cancel Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderCard;

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
