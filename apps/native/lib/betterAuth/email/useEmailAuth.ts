import { useState } from "react";
import { authClient } from "../client";

type AuthError = { message?: string } | null | undefined;

function messageFromError(error: AuthError, fallback: string): string {
  return error?.message || fallback;
}

async function expectSuccess(
  request: Promise<{ error: AuthError }>,
  fallback: string,
): Promise<void> {
  const { error } = await request;
  if (error) {
    throw new Error(messageFromError(error, fallback));
  }
}

export type OtpPurpose = "sign-in" | "email-verification" | "forget-password";

export function useEmailAuth() {
  const [isLoading, setIsLoading] = useState(false);

  async function run<T>(action: () => Promise<T>): Promise<T> {
    setIsLoading(true);
    try {
      return await action();
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    return run(() =>
      expectSuccess(
        authClient.signIn.email({ email, password }),
        "Unable to sign in",
      ),
    );
  }

  async function signUp(input: {
    email: string;
    password: string;
    name: string;
  }) {
    return run(() =>
      expectSuccess(
        authClient.signUp.email(input),
        "Unable to create your account",
      ),
    );
  }

  async function sendVerificationOtp(email: string, type: OtpPurpose) {
    return run(() =>
      expectSuccess(
        authClient.emailOtp.sendVerificationOtp({ email, type }),
        "Unable to send a verification code",
      ),
    );
  }

  async function verifyEmailOtp(email: string, otp: string) {
    return run(() =>
      expectSuccess(
        authClient.emailOtp.verifyEmail({ email, otp }),
        "That code is not valid",
      ),
    );
  }

  async function signInWithEmailOtp(email: string, otp: string) {
    return run(() =>
      expectSuccess(
        authClient.signIn.emailOtp({ email, otp }),
        "That code is not valid",
      ),
    );
  }

  async function requestPasswordReset(email: string) {
    return run(() =>
      expectSuccess(
        authClient.emailOtp.requestPasswordReset({ email }),
        "Unable to start a password reset",
      ),
    );
  }

  async function resetPassword(email: string, otp: string, password: string) {
    return run(() =>
      expectSuccess(
        authClient.emailOtp.resetPassword({ email, otp, password }),
        "Unable to reset your password",
      ),
    );
  }

  return {
    isLoading,
    signIn,
    signUp,
    sendVerificationOtp,
    verifyEmailOtp,
    signInWithEmailOtp,
    requestPasswordReset,
    resetPassword,
  };
}
