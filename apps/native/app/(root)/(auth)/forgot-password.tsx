import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Input, Label, Spinner, TextField } from "heroui-native";
import { useEmailAuth } from "@/lib/betterAuth/email";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isLoading, requestPasswordReset } = useEmailAuth();
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert("Missing email", "Enter the email for your account.");
      return;
    }
    try {
      await requestPasswordReset(email.trim());
      router.push({
        pathname: "/(root)/(auth)/reset-password",
        params: { email: email.trim() },
      } as never);
    } catch (error) {
      Alert.alert(
        "Could not send code",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom + 24,
        paddingHorizontal: 24,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable
        onPress={() => router.back()}
        className="mb-6 flex-row items-center gap-1 self-start"
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={18} />
        <Text className="text-sm text-muted">Back</Text>
      </Pressable>

      <View className="mb-8 gap-2">
        <Text className="text-3xl font-bold text-foreground">
          Forgot password?
        </Text>
        <Text className="text-sm text-muted">
          We'll email a 6-digit code so you can choose a new password.
        </Text>
      </View>

      <View className="gap-4">
        <TextField isRequired>
          <Label>Email</Label>
          <Input
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholder="you@example.com"
          />
        </TextField>

        <Button variant="primary" onPress={handleSubmit} isDisabled={isLoading}>
          {isLoading ? (
            <Spinner size="sm" color="white" />
          ) : (
            <>
              <Ionicons name="mail-outline" size={18} color="white" />
              <Button.Label>Send reset code</Button.Label>
            </>
          )}
        </Button>

        <Pressable
          onPress={() => router.replace("/(root)/(auth)" as never)}
          className="items-center"
        >
          <Text className="text-sm text-muted">Back to sign in</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
