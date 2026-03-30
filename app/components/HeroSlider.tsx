import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { images } from "../../constants";

const SliderImages = [
  images.burgerTransparent,
  images.burgerTransparent,
  images.burgerTransparent,
];

const { width } = Dimensions.get("screen");
const viewportWidth = width;
const spacing = 20;
const caroselItemWidth = viewportWidth + spacing;

function CarouselItem({
  imageUri,
  index,
  scrollX,
}: {
  imageUri: any;
  index: number;
  scrollX: SharedValue<number>;
}) {
  let carouselStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollX.value,
            [index - 1, index, index + 1],
            [viewportWidth / 8, 0, viewportWidth / 8],
          ),
        },
      ],
    };
  });

  return (
    <View style={[styles.fragmentStyles]}>
      <Animated.View
        style={[{
          width: viewportWidth,
          height: 340,
          position: "relative",
        }, carouselStyles]}
      >
        <Image
          style={styles.dryStyles}
          source={images.burgerBackground}
          resizeMode="contain"
        />
        <Image
          style={styles.transparentBurgerStyles}
          source={imageUri}
          resizeMode="contain"
        />
      </Animated.View>
      <View style={styles.heroTextWrapper}>
        <View style={styles.slideIndicator}>
          <LinearGradient
            colors={["#FF611D", "#FFA680"]}
            style={styles.background}
          >
            <View style={styles.firstArm}></View>
          </LinearGradient>

          <View style={styles.indicatorTextWrapper}>
            <Text style={styles.indicatorTextStyles}>2</Text>
            <Text style={styles.indicatorTextShadowStyles}></Text>
          </View>

          <LinearGradient
            // Background Linear Gradient
            colors={["#FF611D", "#FFA680"]}
            style={styles.background}
          >
            <View style={styles.secondArm}></View>
          </LinearGradient>
        </View>

        <View style={styles.slideText}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: "600", color: "#000" }}>
              A Special Dish with —{" "}
            </Text>
            <Text style={{ fontSize: 40, fontWeight: "900", color: "#FF611D" }}>
              Endless Taste
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 12, color: "#6e6e72" }}>
              Close your eyes on the first bite, and you'll swear you're
              standing in a sun-drenched Mediterranean kitchen.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function HeroSlider() {
  let scrollX = useSharedValue(0);
  let onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x / caroselItemWidth;
  });
  return (
    <>
      {/* Primary Sliding Target */}

      <Animated.FlatList
        style={{
          width: viewportWidth,
          height: 500,
          // backgroundColor : "red",
          marginBottom: 100,
        }}
        data={SliderImages}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        contentContainerStyle={{ gap: spacing }}
        scrollEventThrottle={16}
        snapToInterval={width + spacing}
        decelerationRate={"fast"}
        renderItem={({ item, index }) => {
          return (
            <CarouselItem imageUri={item} index={index} scrollX={scrollX} />
          );
        }}
      />

      {/* Secondary Sliding Target */}
    </>
  );
}

export default HeroSlider;

const styles = StyleSheet.create({
  background: {
    borderRadius: 2,
  },
  heroTextWrapper: {
    width: viewportWidth,
    height: 140,
    overflow: "visible",
    flexDirection: "row",
  },
  fragmentStyles: {
    width: viewportWidth,
    flexDirection: "column",
  },
  slideIndicator: {
    width: "16%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  slideText: {
    width: "70%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  firstArm: {
    width: 4,
    height: "16%",
  },
  secondArm: {
    width: 4,
    height: "50%",
    borderRadius: 2,
  },
  indicatorTextWrapper: {
    height: "24%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  indicatorTextStyles: {
    fontSize: 14,
    fontWeight: "bold",
    zIndex: 10,
  },
  indicatorTextShadowStyles: {
    backgroundColor: "#00000020",
    width: 10,
    height: 10,
    bottom: 4,
    left: -4,
    zIndex: 4,
    filter: "blur(4px)",
  },
  customTopBarWrapper: {
    width: "100%",
    height: 40,
    backgroundColor: "#fff",
  },
  heroImageWrapper: {
    width: "100%",
    height: 340,
    position: "relative",
  },
  dryStyles: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  transparentBurgerStyles: {
    width: "100%",
    height: "80%",
    position: "absolute",
    top: "10%",
  },
});
