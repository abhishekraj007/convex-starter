import { Image } from "expo-image";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const ICON_SIZE = 200;
const BG = "#000000";
const RIPPLE_MS = 2200;

function Ripple({ delayMs }: { delayMs: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(
      withDelay(
        delayMs,
        withRepeat(
          withTiming(1, {
            duration: RIPPLE_MS,
            easing: Easing.out(Easing.cubic),
          }),
          -1,
          false,
        ),
      ),
    );
  }, [delayMs, progress]);

  const style = useAnimatedStyle(() => {
    const p = progress.get();
    return {
      // Opacity is 0 at both ends so the loop reset (1 → 0) is invisible.
      opacity: interpolate(p, [0, 0.1, 0.35, 1], [0, 0.45, 0.22, 0]),
      transform: [{ scale: interpolate(p, [0, 1], [0.7, 1.6]) }],
    };
  });

  return <Animated.View style={[styles.ripple, style]} />;
}

export function SplashScreen() {
  const float = useSharedValue(0);

  useEffect(() => {
    float.set(
      withDelay(
        400,
        // reverse: true ping-pongs 0 → 1 → 0 with no hard reset jump.
        withRepeat(
          withTiming(1, {
            duration: 1600,
            easing: Easing.inOut(Easing.sin),
          }),
          -1,
          true,
        ),
      ),
    );
  }, [float]);

  const iconStyle = useAnimatedStyle(() => {
    const f = float.get();
    return {
      // Stay at native splash size (200) from the first frame so the handoff
      // doesn't jump; only add a light float after mount.
      transform: [{ translateY: interpolate(f, [0, 1], [0, -8]) }],
    };
  });

  return (
    <View style={styles.root}>
      <Ripple delayMs={280} />
      <Ripple delayMs={1380} />
      <Animated.View style={iconStyle}>
        <Image
          source={require("@/assets/images/splash-icon.png")}
          style={styles.icon}
          contentFit="contain"
          cachePolicy="memory-disk"
          transition={0}
          accessibilityLabel="App"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
    alignItems: "center",
    justifyContent: "center",
  },
  ripple: {
    position: "absolute",
    width: ICON_SIZE * 1.35,
    height: ICON_SIZE * 1.35,
    borderRadius: ICON_SIZE,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.35)",
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
});
