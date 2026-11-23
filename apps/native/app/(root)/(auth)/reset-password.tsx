import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
  Input,
  InputOTP,
  Label,
  Spinner,
  TextField,
} from "heroui-native";
import { useEmailAuth } from "@/lib/betterAuth/email";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ email?: string }>();
  const initialEmail = typeof params.email === "string" ? params.email : "";

  const { isLoading, resetPassword, sendVerificationOtp } = useEmailAuth();
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleResend = async () => {
    if (!email.trim()) {
      Alert.alert("Missing email", "Enter your email address first.");
      return;
    }
    try {
      await sendVerificationOtp(email.trim(), "forget-password");
      Alert.alert("Code sent", "Check your inbox for a new code.");
    } catch (error) {
      Alert.alert(
        "Could not resend",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert("Missing email", "Enter the email for this reset.");
      return;
    }
    if (otp.length !== 6) {
      Alert.alert("Incomplete code", "Enter all 6 digits from the email.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Weak password", "Use at least 8 characters.");
      return;
    }
    if (password !== confirmation) {
      Alert.alert("Passwords differ", "Enter the same password twice.");
      return;
    }

    try {
      await resetPassword(email.trim(), otp, password);
      Alert.alert("Password updated", "Sign in with your new password.", [
        { text: "OK", onPress: () => router.replace("/(root)/(auth)" as never) },
      ]);
    } catch (error) {
      Alert.alert(
        "Could not reset password",
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
          Choose a new password
        </Text>
        <Text className="text-sm text-muted">
          {email
            ? `Enter the code sent to ${email}.`
            : "Enter your email, reset code and new password."}
        </Text>
      </View>

      <View className="gap-4">
        {!initialEmail ? (
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
        ) : null}

        <View className="items-center gap-2">
          <Label>Reset code</Label>
          <InputOTP value={otp} onChange={setOtp} maxLength={6}>
            <InputOTP.Group>
              {[0, 1, 2].map((index) => (
                <InputOTP.Slot key={index} index={index} />
              ))}
            </InputOTP.Group>
            <InputOTP.Separator />
            <InputOTP.Group>
              {[3, 4, 5].map((index) => (
                <InputOTP.Slot key={index} index={index} />
              ))}
            </InputOTP.Group>
          </InputOTP>
        </View>

        <TextField isRequired>
          <Label>New password</Label>
          <View className="w-full flex-row items-center">
            <Input
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
              autoCapitalize="none"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="flex-1 pr-10"
            />
            <Pressable
              className="absolute right-4"
              onPress={() => setIsPasswordVisible((visible) => !visible)}
              accessibilityRole="button"
              accessibilityLabel={
                isPasswordVisible ? "Hide password" : "Show password"
              }
            >
              <Ionicons
                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                size={18}
              />
            </Pressable>
          </View>
        </TextField>

        <TextField isRequired>
          <Label>Confirm password</Label>
          <Input
            value={confirmation}
            onChangeText={setConfirmation}
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
            autoComplete="new-password"
            placeholder="Repeat your password"
          />
        </TextField>

        <Button variant="primary" onPress={handleSubmit} isDisabled={isLoading}>
          {isLoading ? (
            <Spinner size="sm" color="white" />
          ) : (
            <>
              <Ionicons name="shield-checkmark-outline" size={18} color="white" />
              <Button.Label>Update password</Button.Label>
            </>
          )}
        </Button>

        <View className="items-center gap-3">
          <Pressable onPress={handleResend} disabled={isLoading}>
            <Text className="text-sm text-muted">Resend code</Text>
          </Pressable>
          <Pressable onPress={() => router.replace("/(root)/(auth)" as never)}>
            <Text className="text-sm text-muted">Back to sign in</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
