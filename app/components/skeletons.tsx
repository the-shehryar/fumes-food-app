import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

function SkeletonBox({
  width,
  height,
  borderRadius = 8,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#e0e0e0", "#f5f5f5"],
    ),
  }));

  return (
    <Animated.View
      style={[{ width: width as any, height, borderRadius, }, animatedStyle]}
    />
  );
}

const Spacer = ({ height = 10 }: { height?: number }) => (
  <View style={{ height }} />
);

export function MenuCardSkeleton() {
  return (
    <View style={styles.card}>
      <SkeletonBox width="100%" height={140} borderRadius={12} />
      <Spacer />
      <SkeletonBox width="70%" height={16} />
      <Spacer height={8} />
      <SkeletonBox width="90%" height={12} />
      <Spacer height={4} />
      <SkeletonBox width="60%" height={12} />
      <Spacer />
      <SkeletonBox width="30%" height={16} />
    </View>
  );
}

export function OrderTileSkeleton() {
  return (
    <View style={styles.tile}>
      <SkeletonBox width="80%" height={16} borderRadius={12} />
      <Spacer />
      <SkeletonBox width="60%" height={16} />
      <Spacer height={8} />
      <SkeletonBox width="90%" height={12} />
      <Spacer height={4} />
      <SkeletonBox width="60%" height={12} />
      <Spacer />
      <View style={styles.btnsWrapper}>
      <SkeletonBox width="45%" height={44} />
      <SkeletonBox width="45%" height={44} />
      </View>
    </View>
  );
}

export function MenuGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <View style={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <MenuCardSkeleton key={i} />
      ))}
    </View>
  );
}

export function TileListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <OrderTileSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 12,
  },
  tile: {
    borderRadius : 8,
    width: "100%",
    height: "auto",
    alignSelf: "center",
    marginBottom : 12,
    backgroundColor: "#fff",
    elevation : 12,
    padding : 20,
  },
  list: {
    // flexDirection  : 'column'
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  btnsWrapper : {
    marginTop : 16,
    flexDirection : "row",
    justifyContent : "space-around"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});
