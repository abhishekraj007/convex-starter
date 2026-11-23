"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OTPInput } from "@/components/ui/otp-input";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthShell, FormError } from "@/components/auth/auth-shell";
import { useEmailAuth } from "@/hooks/use-email-auth";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";

  const { isLoading, resetPassword, sendVerificationOtp } = useEmailAuth();
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleResend = async () => {
    setErrorMessage(null);
    setInfoMessage(null);
    if (!email.trim()) {
      setErrorMessage("Enter your email address first.");
      return;
    }
    try {
      await sendVerificationOtp(email.trim(), "forget-password");
      setInfoMessage("A new reset code is on its way.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to resend the code",
      );
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    if (!email.trim()) {
      setErrorMessage("Enter the email address for this reset.");
      return;
    }
    if (otp.length !== 6) {
      setErrorMessage("Enter the 6-digit code from your email.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Use at least 8 characters for your new password.");
      return;
    }
    if (password !== confirmation) {
      setErrorMessage("The passwords do not match.");
      return;
    }

    try {
      await resetPassword(email.trim(), otp, password);
      router.push("/auth?reset=1" as never);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to reset your password",
      );
    }
  };

  return (
    <AuthShell
      title="Choose a new password"
      description={
        email
          ? `Enter the code sent to ${email} and your new password`
          : "Enter your email, reset code and a new password"
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {!initialEmail ? (
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
        ) : null}

        <div className="space-y-2">
          <Label>Reset code</Label>
          <OTPInput
            name="otp"
            autoComplete="one-time-code"
            value={otp}
            onValueChange={(value) => setOtp(value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password">New password</Label>
          <PasswordInput
            name="new-password"
            autoComplete="new-password"
            required
            value={password}
            onValueChange={(value) => setPassword(value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm password</Label>
          <PasswordInput
            name="confirm-password"
            autoComplete="new-password"
            required
            value={confirmation}
            onValueChange={(value) => setConfirmation(value)}
          />
        </div>

        <FormError message={errorMessage} />
        {infoMessage ? (
          <p
            role="status"
            className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300"
          >
            {infoMessage}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update password"}
        </Button>
      </form>

      <div className="flex flex-col items-center gap-2 text-sm">
        <Button
          type="button"
          variant="link"
          onClick={handleResend}
          disabled={isLoading}
        >
          Resend code
        </Button>
        <Link
          href="/auth"
          className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    </AuthShell>
  );
}
