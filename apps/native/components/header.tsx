import { useRouter } from "expo-router";
import { Button } from "heroui-native";
import { Text, View } from "react-native";
import { Crown, Coins } from "lucide-react-native";
import { useConvexAuth, useQuery } from "convex/react";
import { usePurchases } from "@/contexts/purchases-context";
import { api } from "@convex-starter/backend";

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
            <Button
              variant="tertiary"
              size="sm"
              isIconOnly
              className="rounded-full bg-pink-500"
              onPress={presentPaywall}
            >
              <Crown size={16} color="white" />
            </Button>

            <Button
              variant="primary"
              size="sm"
              onPress={() => {
                router.push("/(root)/(main)/buy-credits");
              }}
            >
              <Coins size={16} color="white" />
              <Text className="text-white font-medium">
                {userData?.profile?.credits}
              </Text>
            </Button>
          </>
        ) : (
          <Button
            variant="tertiary"
            size="sm"
            onPress={() => {
              router.push("/(root)/(auth)");
            }}
          >
            <Text className="text-foreground font-medium">Sign In</Text>
          </Button>
        )}
      </View>
    </View>
  );
};
