import Colors from "@/constants/Colors";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, {
  useDerivedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import TabBarItem from "./TabBarItem";

let { ORANGE, DARK, WHITE } = Colors;

function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  // ✅ shared values instead of useState — no re-renders
  const tabBarWidth = useSharedValue(100);
  const tabBarHeight = useSharedValue(20);

  // ✅ derived on UI thread, not JS thread
  const buttonWidth = useDerivedValue(() =>
    tabBarWidth.value / state.routes.length
  );

  const tabPositionX = useSharedValue(0);

  const onTabBarLayout = (e: LayoutChangeEvent) => {
    // ✅ no setState = no re-render
    tabBarWidth.value = e.nativeEvent.layout.width;
    tabBarHeight.value = e.nativeEvent.layout.height;
  };

  const animatedBackgroundCircle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabPositionX.value }],
    width: buttonWidth.value - 40,
    height: tabBarHeight.value - 20,
  }));

  return (
    <View onLayout={onTabBarLayout} style={styles.container}>
      <Animated.View
        style={[
          animatedBackgroundCircle,
          {
            position: "absolute",
            backgroundColor: ORANGE,
            borderRadius: 50,
            left: 20,
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
          tabPositionX.value = withSpring(buttonWidth.value * index, {
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
          navigation.emit({ type: "tabLongPress", target: route.key });
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
    width : '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
});
