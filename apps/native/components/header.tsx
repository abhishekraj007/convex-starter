import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { Crown, Coins } from "lucide-react-native";
import { useConvexAuth, useQuery } from "convex/react";
import { usePurchases } from "@/contexts/purchases-context";
import { api } from "@convex-starter/backend";
import { LiquidGlassButton } from "./liquid-glass-button";

export const Header = () => {
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  const { presentPaywall } = usePurchases();
  const userData = useQuery(
    api.user.fetchUserAndProfile,
    isAuthenticated ? {} : "skip",
  );

  return (
    <View className="flex-row items-center justify-between px-4">
      <View>
        <Text className="text-foreground">Logo</Text>
      </View>

      <View className="flex-row items-center justify-between gap-2">
        {isAuthenticated ? (
          <>
            <LiquidGlassButton
              isIconOnly
              accessibilityLabel="Open premium"
              fallbackClassName="rounded-full bg-pink-500"
              fallbackSize="sm"
              fallbackVariant="tertiary"
              onPress={presentPaywall}
              pressableClassName="bg-pink-500/40"
            >
              <Crown size={16} color="white" />
            </LiquidGlassButton>

            <LiquidGlassButton
              accessibilityLabel="Buy credits"
              fallbackSize="sm"
              fallbackVariant="primary"
              onPress={() => {
                router.push("/(root)/(main)/buy-credits");
              }}
              pressableClassName="bg-accent/35"
            >
              <Coins size={16} color="white" />
              <Text className="text-white font-medium">
                {userData?.profile?.credits}
              </Text>
            </LiquidGlassButton>
          </>
        ) : (
          <LiquidGlassButton
            accessibilityLabel="Sign in"
            fallbackSize="sm"
            fallbackVariant="tertiary"
            onPress={() => {
              router.push("/(root)/(auth)");
            }}
          >
            <Text className="text-foreground font-medium">Sign In</Text>
          </LiquidGlassButton>
        )}
      </View>
    </View>
  );
};
