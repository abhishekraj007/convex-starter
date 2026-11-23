"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@ui-sdk/react/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import {
  AdminAuthShell,
  AdminFormError,
} from "@/components/auth/admin-auth-shell";
import { useEmailAuth } from "@/hooks/use-email-auth";

export default function AuthScreen({
  isPending = false,
  pendingMessage,
}: {
  isPending?: boolean;
  pendingMessage?: string;
} = {}) {
  const router = useRouter();
  const { isLoading, signIn } = useEmailAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSubmitting = isLoading || isPending;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    try {
      await signIn(email.trim(), password);
      toast.info("Verifying admin access...");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to sign in",
      );
    }
  };

  return (
    <AdminAuthShell
      title="Sign in to Console"
      description="Use an account with the admin role. Everyone else is signed out automatically."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="password">Password</Label>
            <Link
              href={"/auth/forgot-password" as never}
              className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            controlId="password"
            name="password"
            autoComplete="current-password"
            required
            disabled={isSubmitting}
            value={password}
            onValueChange={(value) => setPassword(value)}
          />
        </div>

        <AdminFormError message={errorMessage} />

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Continue"}
        </Button>
      </form>

      {pendingMessage && !errorMessage ? (
        <p
          role="status"
          className="flex items-center justify-center gap-2 rounded-lg border border-border bg-subtle px-3 py-2 text-center text-[13px] text-muted-foreground"
        >
          {pendingMessage}
        </p>
      ) : null}

      <p className="border-t border-border pt-5 text-sm text-muted-foreground">
        <Link
          href={"/auth/sign-up" as never}
          className="font-medium text-brand-text underline-offset-4 hover:underline"
        >
          Need an account? Sign up
        </Link>
      </p>
    </AdminAuthShell>
  );
}
