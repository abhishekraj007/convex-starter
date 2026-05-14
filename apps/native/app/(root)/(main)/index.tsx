import { Header, LiquidGlassButton } from "@/components";
import { Card } from "heroui-native";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Bell, UploadCloud, User } from "lucide-react-native";

export default function HomeRoute() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        <Header />
        <View className="p-4 gap-4">
          <View className="gap-1">
            <Text className="text-3xl font-bold text-foreground">Home</Text>
            <Text className="text-sm text-muted">
              Reusable account, upload, and notification tools are now one tap
              away in the tab bar.
            </Text>
          </View>

          <Card>
            <Card.Body className="gap-4">
              <Card.Title>Quick Actions</Card.Title>
              <View className="gap-3">
                <LiquidGlassButton
                  fallbackVariant="secondary"
                  fullWidth
                  onPress={() =>
                    router.push("/(root)/(main)/(tabs)/uploads" as any)
                  }
                  pressableClassName="bg-accent/35"
                >
                  <UploadCloud size={18} color="white" />
                  <Text className="font-semibold text-white">Open Uploads</Text>
                </LiquidGlassButton>
                <LiquidGlassButton
                  fallbackVariant="secondary"
                  fullWidth
                  onPress={() =>
                    router.push("/(root)/(main)/(tabs)/notifications" as any)
                  }
                  pressableClassName="bg-accent/35"
                >
                  <Bell size={18} color="white" />
                  <Text className="font-semibold text-white">
                    Open Notifications
                  </Text>
                </LiquidGlassButton>
                <LiquidGlassButton
                  fallbackVariant="tertiary"
                  fullWidth
                  onPress={() =>
                    router.push("/(root)/(main)/(tabs)/account" as any)
                  }
                  pressableClassName="bg-surface-tertiary/70"
                >
                  <User size={18} color="white" />
                  <Text className="font-semibold text-white">Open Account</Text>
                </LiquidGlassButton>
              </View>
            </Card.Body>
          </Card>
        </View>
      </SafeAreaView>
    </View>
  );
}
