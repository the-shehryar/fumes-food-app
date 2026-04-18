import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

let StarColor = '#FBBF24'

const Stars = ({ rating, size = 14 }: { rating: number; size?: number }) => (
  <View style={{ flexDirection: "row" }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Ionicons
        key={i}
        name={i <= rating ? "star" : "star-outline"}
        size={size}
        color= {StarColor}
        style={{ marginRight: 2 }}
      />
    ))}
  </View>
);

export default Stars;