"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OTPInput } from "@/components/ui/otp-input";
import {
  AdminAuthShell,
  AdminFormError,
} from "@/components/auth/admin-auth-shell";
import { useEmailAuth, type OtpPurpose } from "@/hooks/use-email-auth";

export function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";
  const redirectTo = searchParams.get("redirectTo") || "/";
  const purpose: OtpPurpose =
    searchParams.get("type") === "sign-in" ? "sign-in" : "email-verification";

  const {
    isLoading,
    sendVerificationOtp,
    verifyEmailOtp,
    signInWithEmailOtp,
  } = useEmailAuth();
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    if (!email.trim()) {
      setErrorMessage("Enter your email address.");
      return;
    }
    if (otp.length !== 6) {
      setErrorMessage("Enter the 6-digit code from your email.");
      return;
    }
    try {
      if (purpose === "sign-in") {
        await signInWithEmailOtp(email.trim(), otp);
      } else {
        await verifyEmailOtp(email.trim(), otp);
      }
      router.push(redirectTo as never);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to verify the code",
      );
    }
  };

  const handleResend = async () => {
    setErrorMessage(null);
    setInfoMessage(null);
    if (!email.trim()) {
      setErrorMessage("Enter your email address first.");
      return;
    }
    try {
      await sendVerificationOtp(email.trim(), purpose);
      setInfoMessage("A new code is on its way.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to resend the code",
      );
    }
  };

  return (
    <AdminAuthShell
      title="Verify your email"
      description={
        email
          ? `Enter the 6-digit code sent to ${email}`
          : "Enter your email to get a code"
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {!initialEmail ? (
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
        ) : null}

        <div className="space-y-2">
          <Label>Verification code</Label>
          <OTPInput
            name="otp"
            autoComplete="one-time-code"
            value={otp}
            onValueChange={(value) => setOtp(value)}
            autoFocus
          />
        </div>

        <AdminFormError message={errorMessage} />
        {infoMessage ? (
          <p
            role="status"
            className="rounded-md bg-muted/60 px-3 py-2 text-sm text-muted-foreground"
          >
            {infoMessage}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify and continue"}
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
          href="/"
          className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    </AdminAuthShell>
  );
}
