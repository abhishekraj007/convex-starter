"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import {
  AdminAuthShell,
  AdminFormError,
} from "@/components/auth/admin-auth-shell";
import { useEmailAuth } from "@/hooks/use-email-auth";
import { useQuery } from "convex/react";
import { api } from "@convex-starter/backend/convex/_generated/api";

export function SignUpForm() {
  const router = useRouter();
  const { isLoading, signUp } = useEmailAuth();
  const authSettings = useQuery(api.authSettings.getAuthSettings);
  const requireEmailVerification =
    authSettings?.requireEmailVerification ?? true;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    if (name.trim().length < 2) {
      setErrorMessage("Please enter your name.");
      return;
    }
    try {
      await signUp({ email: email.trim(), password, name: name.trim() });
      if (!requireEmailVerification) {
        router.push("/" as never);
        router.refresh();
        return;
      }
      const params = new URLSearchParams({
        email: email.trim(),
        type: "email-verification",
      });
      router.push(`/auth/verify-otp?${params.toString()}` as never);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to create an account",
      );
    }
  };

  return (
    <AdminAuthShell
      title="Create admin account"
      description="Verify your email, then an existing admin must grant access"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>
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
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            controlId="password"
            name="password"
            autoComplete="new-password"
            required
            value={password}
            onValueChange={(value) => setPassword(value)}
          />
          <p className="text-xs text-muted-foreground">
            Use at least 8 characters.
          </p>
        </div>

        <AdminFormError message={errorMessage} />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create account"}
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
