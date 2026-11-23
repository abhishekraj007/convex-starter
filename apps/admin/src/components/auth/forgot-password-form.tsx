"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AdminAuthShell,
  AdminFormError,
} from "@/components/auth/admin-auth-shell";
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
    <AdminAuthShell
      title="Reset admin password"
      description="We'll email a 6-digit code to verify it's you"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
            autoFocus
          />
        </div>

        <AdminFormError message={errorMessage} />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send reset code"}
        </Button>
      </form>

      <p className="text-center text-sm">
        <Link
          href="/"
          className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </AdminAuthShell>
  );
}
