import type { ComponentProps, PropsWithChildren } from "react";
import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import { Button } from "heroui-native";
import {
  Platform,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useAppTheme } from "@/contexts/app-theme-context";
import { cn } from "@/lib/utils";

type HeroUIButtonProps = ComponentProps<typeof Button>;

type LiquidGlassButtonProps = PropsWithChildren<{
  accessibilityLabel?: string;
  className?: string;
  fallbackClassName?: string;
  fallbackSize?: HeroUIButtonProps["size"];
  fallbackVariant?: HeroUIButtonProps["variant"];
  fullWidth?: boolean;
  isDisabled?: boolean;
  isIconOnly?: boolean;
  onPress?: PressableProps["onPress"];
  pressableClassName?: string;
  style?: StyleProp<ViewStyle>;
  tintColor?: string;
}>;

export function LiquidGlassButton({
  accessibilityLabel,
  children,
  className,
  fallbackClassName,
  fallbackSize = "md",
  fallbackVariant = "secondary",
  fullWidth = false,
  isDisabled = false,
  isIconOnly = false,
  onPress,
  pressableClassName,
  style,
  tintColor,
}: LiquidGlassButtonProps) {
  const { isDark } = useAppTheme();
  const canUseLiquidGlass =
    Platform.OS === "ios" &&
    isLiquidGlassAvailable() &&
    isGlassEffectAPIAvailable();

  if (!canUseLiquidGlass) {
    return (
      <Button
        accessibilityLabel={accessibilityLabel}
        className={cn(fullWidth && "w-full", fallbackClassName, className)}
        isDisabled={isDisabled}
        isIconOnly={isIconOnly}
        onPress={onPress}
        size={fallbackSize}
        variant={fallbackVariant}
      >
        {children}
      </Button>
    );
  }

  return (
    <GlassView
      colorScheme={isDark ? "dark" : "light"}
      glassEffectStyle="regular"
      isInteractive
      style={[
        styles.glass,
        isIconOnly ? styles.iconButton : styles.button,
        fullWidth && styles.fullWidth,
        style,
      ]}
      tintColor={tintColor}
    >
      <Pressable
        accessibilityLabel={accessibilityLabel}
        className={cn(
          "flex-row items-center justify-center gap-2",
          isIconOnly ? "h-9 w-9" : "min-h-10 px-4 py-2",
          isDisabled && "opacity-disabled",
          pressableClassName,
        )}
        disabled={isDisabled}
        onPress={onPress}
      >
        {children}
      </Pressable>
    </GlassView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  glass: {
    borderRadius: 999,
    overflow: "hidden",
  },
  iconButton: {
    height: 36,
    width: 36,
  },
});
