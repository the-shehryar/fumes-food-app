import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";

//? Static Images
import { images } from "../../constants";

const SliderImages = [
  {
    id: 1,
    image: images.burgerTransparent,
    mainHeading: "Smashed, Seared",
    subHeading: "Burger Perfection",
    description:
      "Premium beef smashed onto a scorching griddle, layered with melted cheese, crisp lettuce, and our secret house sauce — every bite hits different.",
  },
  {
    id: 2,
    image: images.pizzaTransparentFull,
    mainHeading: "Wood-Fired Crust",
    subHeading: "Slice of Heaven",
    description:
      "Bubbling mozzarella, rich tomato sauce, and hand-stretched dough baked to a golden crisp. One slice and you're in Naples.",
  },
  {
    id: 3,
    image: images.biryaniTransparent,
    mainHeading: "Shahi Biryani",
    subHeading: "Slow-Cooked Spices",
    description:
      "Fragrant basmati rice layered with tender chicken, caramelized onions, and a blend of aged spices. A dish fit for royalty.",
  },
];

const { width } = Dimensions.get("screen");
const viewportWidth = width;
const spacing = 20;
const caroselItemWidth = viewportWidth + spacing;

function CarouselItem({
  imageUri,
  index,
  activeIndex,
}: {
  imageUri: any;
  index: number;
  activeIndex: number;
}) {
  const translateYMainHeading = useSharedValue(30);
  const opacityMainHeading = useSharedValue(0);
  const translateYSecHeading = useSharedValue(30);
  const opacitySecHeading = useSharedValue(0);
  const translateYDescHeading = useSharedValue(30);
  const opacityDescHeading = useSharedValue(0);

  useEffect(() => {
    if(activeIndex === index){
      translateYMainHeading.value = 30;
      opacityMainHeading.value = 0;
      translateYSecHeading.value = 30;
      opacitySecHeading.value = 0;
      translateYDescHeading.value = 30;
      opacityDescHeading.value = 0;
  
      translateYMainHeading.value = withTiming(0, { duration: 400 });
      opacityMainHeading.value = withTiming(1, { duration: 400 });
      translateYSecHeading.value = withDelay(100, withTiming(0, { duration: 400 }));
      opacitySecHeading.value = withDelay(100, withTiming(1, { duration: 400 }));
      translateYDescHeading.value = withDelay(200, withTiming(0, { duration: 400 }));;
      opacityDescHeading.value = withDelay(200, withTiming(1, { duration: 400 }));;
    }else {
      translateYMainHeading.value = 30;
      opacityMainHeading.value = 0;
      translateYSecHeading.value = 30;
      opacitySecHeading.value = 0;
      translateYDescHeading.value = 30;
      opacityDescHeading.value = 0;
    }

  }, [activeIndex]);

  const animatedMainStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateYMainHeading.value }],
    opacity: opacityMainHeading.value,
  }));
  const animatedSecStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateYSecHeading.value }],
    opacity: opacitySecHeading.value,
  }));
  const animatedDescStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateYDescHeading.value }],
    opacity: opacityDescHeading.value,
  }));
  let total = SliderImages.length
  return (
    <View style={[styles.fragmentStyles]}>
      <View
        style={[
          {
            width: viewportWidth,
            height: 320,
            position: "relative",
          },
        ]}
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
      </View>
      <View style={styles.heroTextWrapper}>
        <View style={styles.slideIndicator}>
          <LinearGradient
            colors={["#FF611D", "#FFA680"]}
            style={styles.background}
          >
            <View style={styles.firstArm}></View>
          </LinearGradient>

          <View style={styles.indicatorTextWrapper}>
            <Text style={styles.indicatorTextStyles}>{"🔥"}</Text>
            <Text style={styles.indicatorTextShadowStyles}></Text>
          </View>

          <LinearGradient
            // Background Linear Gradient
            colors={["#FF611D", "#FFA680"]}
            style={styles.background}
          >
            <View style={[styles.secondArm]}></View>
          </LinearGradient>
        </View>

        <View style={styles.slideText}>
          <View>
            <Animated.Text
              style={[
                { fontSize: 20, fontWeight: "600", color: "#000" },
                animatedMainStyle,
              ]}
            >
             {SliderImages[index].subHeading}
            </Animated.Text>
            <Animated.Text
              style={[{ fontSize: 32, fontWeight: "900", color: "#FF611D" }, animatedSecStyle]}
              >
              {SliderImages[index].mainHeading}
            </Animated.Text>
          </View>
          <View>
            <Animated.Text style={[{ fontSize: 12, color: "#6e6e72" }, animatedDescStyle]}>
              {SliderImages[index].description}
            </Animated.Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function HeroSlider() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  //? Get current Index
  // const currentIndex = ref.current?.getCurrentIndex();
  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View
      style={{ width: "100%", height: "auto", justifyContent: "flex-start" }}
    >
      {/* Primary Sliding Target */}
      <Carousel
        ref={ref}
        style={{ width, height: 480 }}
        autoPlay={true}
        autoPlayInterval={5000}
        width={width}
        data={SliderImages}
        onProgressChange={(offsetProgress, absoluteProgress) => {
          // absoluteProgress is a float like 0.0, 1.0, 2.0
          // Round it to snap to the nearest index
          const index = Math.round(absoluteProgress);
          setActiveIndex(index);
          progress.value = absoluteProgress; // keeping existing progress shared value
        }}
        renderItem={({ item, index }) => (
          <CarouselItem
            imageUri={item.image}
            index={index}
            activeIndex={activeIndex}
          />
        )}
      />

      {/* <Pagination.Basic
        progress={progress}
        data={SliderImages}
        dotStyle={{ backgroundColor: "#ff611d41", borderRadius: 50 }}
        containerStyle={{ gap: 5, marginTop: 10 }}
        onPress={onPressPagination}
      /> */}
    </View>
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
    height : '16%'
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
    fontSize: 16,
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
