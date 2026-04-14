import Colors from "@/constants/Colors";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import TabBarItem from "./TabBarItem";

let { ORANGE, DARK, BORDER, WHITE } = Colors;
type RouteNames = "index" | "search" | "cart" | "profile";

function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  let [dimensions, setDimensions] = useState({ width: 100, height: 20 });
  const buttonWidth = dimensions.width / state.routes.length;
  const onTabBarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };
  const tabPositionX = useSharedValue(0);

  const animatedBackgroundCircle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  return (
    <View onLayout={onTabBarLayout} style={styles.container}>
      <Animated.View
        style={[
          animatedBackgroundCircle,
          {
            position: "absolute",
            backgroundColor: ORANGE,
            borderRadius: 50,
            width: buttonWidth - 40,
            left: 20,
            height: dimensions.height - 20,
          },
        ]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          tabPositionX.value = withSpring(buttonWidth * index, {
            duration: 500,
          });
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarItem
            key={route.key}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? WHITE : DARK}
            onLongPress={onLongPress}
            onPress={onPress}
            label={label}
          />
        );
      })}
    </View>
  );
}

export default TabBar;

let styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    backgroundColor: "#FFF",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    // marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
});
