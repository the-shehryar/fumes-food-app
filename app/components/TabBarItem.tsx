import Colors from "@/constants/Colors";
import Icon from "@/constants/icon";
import { RouteNames } from "@/types/type";
import { PlatformPressable } from "@react-navigation/elements";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

let {
  ORANGE,
  DARK,
  WHITE,
  ORANGE_LIGHT,
  GREEN,
  GRAY,
  GREEN_LIGHT,
  GRAY_LIGHT,
} = Colors;

const TabBarItem = ({
  onPress,
  onLongPress,
  isFocused,
  routeName,
  color,
  label,
}: {
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  routeName: string;
  color: string;
  label: string | Function;
}) => {
  let scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      {
        duration: 350,
      },
    );
  }, [isFocused, scale]);

  const animatedTabBarTextStyles = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);
    return { opacity };
  });

  const animatedTabbarIconStyles = useAnimatedStyle(()=>{
    
    const scaleValue  = interpolate(scale.value, [0, 1], [1, 1.2])
    const top = interpolate(scale.value, [0, 1], [0, 8])
    return {
        transform  : [{
            scale : scaleValue
        }],
        top : top
    }
  })
  return (
    <PlatformPressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabBarItem}
    >
      <View style={styles.route}>
        <Animated.View style={animatedTabbarIconStyles}>
          {Icon[routeName as RouteNames]({ color: isFocused ? WHITE : DARK })}
        </Animated.View>
        <Animated.Text
          style={[{ color: DARK, fontSize: 10 }, animatedTabBarTextStyles]}
        >
          {typeof label === "string"
            ? label
            : label({
                focused: isFocused,
                color: isFocused ? ORANGE : DARK,
                position: "below-icon",
                children: routeName,
              })}
        </Animated.Text>
      </View>
    </PlatformPressable>
  );
};

export default TabBarItem;

const styles = StyleSheet.create({
  tabBarItem: {
    flex: 1,
    // backgroundColor : "green",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 5,
  },
  route: {
    paddingVertical : 10,
    // backgroundColor : "red",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedRoute: {
    width: "auto",
    padding: 10,
    backgroundColor: ORANGE,
  },
});
