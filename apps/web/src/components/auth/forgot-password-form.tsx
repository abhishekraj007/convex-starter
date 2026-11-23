"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell, FormError } from "@/components/auth/auth-shell";
import { useEmailAuth } from "@/hooks/use-email-auth";

export function ForgotPasswordForm() {
  const router = useRouter();
  const { isLoading, requestPasswordReset } = useEmailAuth();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      await requestPasswordReset(email.trim());
      router.push(
        `/auth/reset-password?email=${encodeURIComponent(email.trim())}` as never,
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to start a password reset",
      );
    }
  };

  return (
    <AuthShell
      title="Forgot your password?"
      description="We'll email you a 6-digit code to choose a new one."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
            autoFocus
          />
        </div>

        <FormError message={errorMessage} />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send reset code"}
        </Button>
      </form>

      <p className="text-center text-sm">
        <Link
          href="/auth"
          className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
