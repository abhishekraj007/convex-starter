import { LinearGradient } from "expo-linear-gradient";
import {
  ScrollShadow as HeroScrollShadow,
  type ScrollShadowProps,
} from "heroui-native";

export type AppScrollShadowProps = Omit<
  ScrollShadowProps,
  "LinearGradientComponent"
>;

export function ScrollShadow(props: AppScrollShadowProps) {
  return (
    <HeroScrollShadow LinearGradientComponent={LinearGradient} {...props} />
  );
}
