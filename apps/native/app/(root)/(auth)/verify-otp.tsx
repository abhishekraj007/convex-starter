import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
  Input,
  InputOTP,
  Label,
  Spinner,
  TextField,
} from "heroui-native";
import { useEmailAuth, type OtpPurpose } from "@/lib/betterAuth/email";

export default function VerifyOtpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    email?: string;
    type?: string;
    redirectTo?: string;
  }>();
  const initialEmail =
    typeof params.email === "string" ? params.email : "";
  const purpose: OtpPurpose =
    params.type === "sign-in" ? "sign-in" : "email-verification";
  const redirectTo =
    typeof params.redirectTo === "string"
      ? params.redirectTo
      : "/(root)/(main)";

  const {
    isLoading,
    sendVerificationOtp,
    verifyEmailOtp,
    signInWithEmailOtp,
  } = useEmailAuth();
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    if (!email.trim()) {
      Alert.alert("Missing email", "Enter the email address you used.");
      return;
    }
    if (otp.length !== 6) {
      Alert.alert("Incomplete code", "Enter all 6 digits from the email.");
      return;
    }

    try {
      if (purpose === "sign-in") {
        await signInWithEmailOtp(email.trim(), otp);
      } else {
        await verifyEmailOtp(email.trim(), otp);
      }
      router.replace(redirectTo as never);
    } catch (error) {
      Alert.alert(
        "Verification failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      Alert.alert("Missing email", "Enter your email address first.");
      return;
    }
    try {
      await sendVerificationOtp(email.trim(), purpose);
      Alert.alert("Code sent", "Check your inbox for a new 6-digit code.");
    } catch (error) {
      Alert.alert(
        "Could not resend",
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
          Check your email
        </Text>
        <Text className="text-sm text-muted">
          {email
            ? `Enter the 6-digit code sent to ${email}.`
            : "Enter your email and the 6-digit code we send you."}
        </Text>
      </View>

      <View className="gap-5">
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
          <Label>Verification code</Label>
          <InputOTP
            value={otp}
            onChange={setOtp}
            maxLength={6}
            onComplete={(code) => setOtp(code)}
          >
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

        <Button variant="primary" onPress={handleVerify} isDisabled={isLoading}>
          {isLoading ? (
            <Spinner size="sm" color="white" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={18} color="white" />
              <Button.Label>Verify and continue</Button.Label>
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
