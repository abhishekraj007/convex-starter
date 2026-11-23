import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Input, Label, Spinner, TextField } from "heroui-native";
import { useEmailAuth } from "@/lib/betterAuth/email";

export default function EmailAuthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { isLoading, signIn, signUp } = useEmailAuth();

  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isSignIn = mode === "sign-in";

  const handleSubmit = async () => {
    if (!email.trim() || password.length < 8) {
      Alert.alert("Check your details", "Use a valid email and at least 8 characters.");
      return;
    }
    if (!isSignIn && name.trim().length < 2) {
      Alert.alert("Check your details", "Please enter your name.");
      return;
    }

    try {
      if (isSignIn) {
        await signIn(email.trim(), password);
        router.replace("/(root)/(main)" as never);
        return;
      }

      await signUp({
        email: email.trim(),
        password,
        name: name.trim(),
      });
      router.push({
        pathname: "/(root)/(auth)/verify-otp",
        params: { email: email.trim(), type: "email-verification" },
      } as never);
    } catch (error) {
      Alert.alert(
        "Something went wrong",
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
        minHeight: height,
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
          {isSignIn ? "Sign in with email" : "Create your account"}
        </Text>
        <Text className="text-sm text-muted">
          {isSignIn
            ? "Use your password or switch to a one-time code."
            : "We'll email a 6-digit code to verify your address."}
        </Text>
      </View>

      <View className="gap-4">
        {!isSignIn ? (
          <TextField isRequired>
            <Label>Name</Label>
            <Input
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              textContentType="name"
              placeholder="Ada Lovelace"
            />
          </TextField>
        ) : null}

        <TextField isRequired>
          <Label>Email</Label>
          <Input
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            placeholder="you@example.com"
          />
        </TextField>

        <TextField isRequired>
          <Label>Password</Label>
          <View className="w-full flex-row items-center">
            <Input
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
              autoCapitalize="none"
              autoComplete={isSignIn ? "current-password" : "new-password"}
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

        <Button
          variant="primary"
          onPress={handleSubmit}
          isDisabled={isLoading}
          className="mt-2"
        >
          {isLoading ? (
            <Spinner size="sm" color="white" />
          ) : (
            <>
              <Ionicons
                name={isSignIn ? "log-in-outline" : "person-add-outline"}
                size={18}
                color="white"
              />
              <Button.Label>
                {isSignIn ? "Sign In" : "Create Account"}
              </Button.Label>
            </>
          )}
        </Button>

        <View className="items-center gap-3 pt-2">
          <Pressable
            onPress={() => {
              setMode(isSignIn ? "sign-up" : "sign-in");
            }}
            accessibilityRole="button"
          >
            <Text className="text-sm text-muted">
              {isSignIn
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Text>
          </Pressable>

          {isSignIn ? (
            <>
              <Pressable
                onPress={() =>
                  router.push("/(root)/(auth)/forgot-password" as never)
                }
                accessibilityRole="button"
              >
                <Text className="text-sm text-muted">Forgot password?</Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/(root)/(auth)/verify-otp",
                    params: { email: email.trim(), type: "sign-in" },
                  } as never)
                }
                accessibilityRole="button"
              >
                <Text className="text-sm text-muted">Use a one-time code</Text>
              </Pressable>
            </>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}
