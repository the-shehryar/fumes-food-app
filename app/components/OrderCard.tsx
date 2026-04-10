import Colors from "@/constants/Colors";
import { CartItemType, Order } from "@/types/type";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

let {
  ORANGE,
  GRAY,
  GREEN,
  GREEN_LIGHT,
  GRAY_LIGHT,
  BORDER,
  ORANGE_LIGHT,
  DARK,
} = Colors;

const OrderCard = ({
  order,
  onCancel,
}: {
  order: Order;
  onCancel: () => void;
}) => {
  let [orderStatus, setOrderStatus] = useState("Pending");
  let [orderItems, setOrderItems] = useState<CartItemType[] | undefined>(
    undefined,
  );

  function parseOrderItems(data: string) {
    return JSON.parse(data) as Order[];
  }

  useEffect(() => {
    if (order) {
      let orderStatusCapitalized =
        order.status.charAt(0).toUpperCase() + order.status.slice(1);
      setOrderStatus(orderStatusCapitalized);
      let items = parseOrderItems(order.items);
      setOrderItems(items as unknown as CartItemType[]);
    }
    console.log(orderItems, null, 2);
  }, []);
  return (
    <View style={[styles.card]}>
      <View style={styles.cardMainTextWrapper}>
        <View style={styles.defaultbadge}>
          <Text style={{ color: GREEN, fontSize: 12 }}>{orderStatus}</Text>
        </View>
        <Text style={styles.label}>Order ID : {order.$id}</Text>
        <Text style={styles.address}>{order.address}</Text>
      </View>

      {orderItems?.map((item) => (
        <View key={item.id} style={styles.itembar}>
          <Text style={styles.itemqty}>
            {item.quantity}
          </Text>
          <Text style={styles.seperator}>
            x
          </Text>
          <Text style={styles.itemname}>
            {item.name}
          </Text>
        </View>
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
    width: "100%",
    elevation: 10,
    padding: 20,
    alignSelf: "center",
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
    marginTop: 16,
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
    // marginHorizontal: 4,
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
    maxWidth: 120,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GREEN_LIGHT,
    borderColor: GREEN,
    borderWidth: 1,
    borderRadius: 12,
  },
  label: {
    // alignSelf : 'center',
    fontWeight: "700",
    fontSize: 16,
    marginRight: 8,
    color: DARK,
    marginTop: 8,
    // marginBottom: 4,
  },
  address: {
    fontSize: 14,
    fontWeight: 200,
    color: GRAY,
    marginVertical : 4,
  },
  itemname: {
    fontSize: 13,
    color: ORANGE,
    marginTop: 4,
  },
  itemqty: {
    fontSize: 13,
    color: GRAY,
    marginTop: 4,
  },
  itembar : {
    width : '100%',
    height : 'auto',
    flexDirection : "row"
  },
  seperator : {
    fontSize: 13,
    color: GRAY,
    marginTop: 4,
    marginHorizontal : 8
  }
});
