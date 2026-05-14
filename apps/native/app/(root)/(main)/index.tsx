import { Header } from "@/components";
import { Button, Card } from "heroui-native";
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
                <Button
                  variant="secondary"
                  onPress={() =>
                    router.push("/(root)/(main)/(tabs)/uploads" as any)
                  }
                >
                  <UploadCloud size={18} color="white" />
                  <Button.Label>Open Uploads</Button.Label>
                </Button>
                <Button
                  variant="secondary"
                  onPress={() =>
                    router.push("/(root)/(main)/(tabs)/notifications" as any)
                  }
                >
                  <Bell size={18} color="white" />
                  <Button.Label>Open Notifications</Button.Label>
                </Button>
                <Button
                  variant="tertiary"
                  onPress={() =>
                    router.push("/(root)/(main)/(tabs)/account" as any)
                  }
                >
                  <User size={18} color="white" />
                  <Button.Label>Open Account</Button.Label>
                </Button>
              </View>
            </Card.Body>
          </Card>
        </View>
      </SafeAreaView>
    </View>
  );
}
