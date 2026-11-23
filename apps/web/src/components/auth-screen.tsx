"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthShell, FormError } from "@/components/auth/auth-shell";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { useEmailAuth } from "@/hooks/use-email-auth";

export default function AuthScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const passwordWasReset = searchParams.get("reset") === "1";

  const { isLoading, signIn, signUp } = useEmailAuth();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSignIn = mode === "sign-in";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!isSignIn && name.trim().length < 2) {
      setErrorMessage("Please enter your name.");
      return;
    }

    try {
      if (isSignIn) {
        await signIn(email.trim(), password);
        router.push(redirectTo as never);
        router.refresh();
        return;
      }

      await signUp({
        email: email.trim(),
        password,
        name: name.trim(),
      });
      const params = new URLSearchParams({
        email: email.trim(),
        type: "email-verification",
      });
      if (redirectTo !== "/dashboard") {
        params.set("redirectTo", redirectTo);
      }
      router.push(`/auth/verify-otp?${params.toString()}` as never);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  return (
    <AuthShell
      title={isSignIn ? "Welcome back" : "Create an account"}
      description={
        isSignIn
          ? "Sign in to your account to continue"
          : "Start with email and verify your inbox"
      }
    >
      {passwordWasReset ? (
        <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
          Your password was updated. Sign in with your new password.
        </p>
      ) : null}

      <SocialAuthButtons disabled={isLoading} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isSignIn ? (
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Ada Lovelace"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="password">Password</Label>
            {isSignIn ? (
              <Link
                href={"/auth/forgot-password" as never}
                className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Forgot password?
              </Link>
            ) : null}
          </div>
          <PasswordInput
            controlId="password"
            name="password"
            autoComplete={isSignIn ? "current-password" : "new-password"}
            required
            value={password}
            onValueChange={(value) => setPassword(value)}
          />
          {!isSignIn ? (
            <p className="text-xs text-muted-foreground">
              Use at least 8 characters.
            </p>
          ) : null}
        </div>

        <FormError message={errorMessage} />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading
            ? "Please wait..."
            : isSignIn
              ? "Sign In"
              : "Create Account"}
        </Button>
      </form>

      <div className="space-y-2 text-center text-sm">
        <button
          type="button"
          onClick={() => {
            setMode(isSignIn ? "sign-up" : "sign-in");
            setErrorMessage(null);
          }}
          className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {isSignIn
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
        {isSignIn ? (
          <p className="text-xs text-muted-foreground">
            Prefer a one-time code?{" "}
            <Link
              href={`/auth/verify-otp?email=${encodeURIComponent(email)}&type=sign-in` as never}
              className="underline underline-offset-4 hover:text-foreground"
            >
              Use email OTP
            </Link>
          </p>
        ) : null}
      </div>

      <p className="px-4 text-center text-xs text-muted-foreground">
        By continuing, you agree to our{" "}
        <Link href={"/terms" as never} className="underline underline-offset-4">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href={"/privacy" as never} className="underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </p>
    </AuthShell>
  );
}
