import { type GenericCtx } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { requireActionCtx } from "@convex-dev/better-auth/utils";
import { expo } from "@better-auth/expo";
import type { DataModel } from "../../_generated/dataModel";
import { internal } from "../../_generated/api";
import authConfig from "../../auth.config";
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { authComponent } from "./component";

// web client id com.noosperai.feelchat.web

const siteUrl = process.env.SITE_URL!;
const authBaseUrl = process.env.CONVEX_SITE_URL ?? siteUrl;
const nativeAppUrl = process.env.NATIVE_APP_URL || "quotes://";
const iosAppBundleIdentifier = "com.noosperai.quotes";
const appleClientId = process.env.APPLE_CLIENT_ID || iosAppBundleIdentifier;
// Generated via: node scripts/generate-apple-secret.mjs
const appleClientSecret = process.env.APPLE_CLIENT_SECRET;

const appleAudience = Array.from(
  new Set([appleClientId, iosAppBundleIdentifier]),
);
const extraTrustedOrigins = (process.env.TRUSTED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const trustedOrigins = Array.from(
  new Set([
    siteUrl,
    authBaseUrl,
    nativeAppUrl,
    // Local development
    "http://localhost:3004", // web local
    "http://localhost:3015", // admin local
    // Production (Railway)
    "https://dating-ai.up.railway.app",
    "https://admin-dating.up.railway.app",
    "https://web-dating.up.railway.app",
    "https://admin-dating-dev.up.railway.app",
    "https://appleid.apple.com",
    ...extraTrustedOrigins,
  ]),
);

export function createAuth(ctx: GenericCtx<DataModel>) {
  return betterAuth({
    baseURL: authBaseUrl,
    trustedOrigins,
    database: authComponent.adapter(ctx),
    user: {
      deleteUser: {
        enabled: true,
      },
    },
    emailAndPassword: {
      enabled: true,
      // New email/password accounts must prove ownership of their inbox with
      // an OTP before a session is issued. Social providers are unaffected.
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url }) => {
        // Schedule the send so the HTTP action returns quickly (and does not
        // leak whether the address exists through response timing).
        const actionCtx = requireActionCtx(ctx);
        await actionCtx.scheduler.runAfter(
          0,
          internal.auth.deliverPasswordResetEmail,
          {
            to: user.email,
            resetUrl: url,
          },
        );
      },
    },
    // Better Auth rate limiting protects the OTP endpoints (and the rest of
    // the auth surface). The email OTP plugin also declares per-path limits.
    rateLimit: {
      enabled: true,
      window: 60,
      max: 100,
    },
    socialProviders: {
      google: {
        prompt: "select_account",
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
      apple: {
        clientId: appleClientId,
        ...(appleClientSecret ? { clientSecret: appleClientSecret } : {}),
        appBundleIdentifier: iosAppBundleIdentifier,
        audience: appleAudience,
      },
    },
    // crossDomain plugin enables multi-app OAuth by skipping state cookie check
    plugins: [
      expo(),
      convex({ authConfig, jwksRotateOnTokenGenerationError: true }),
      crossDomain({ siteUrl }),
      emailOTP({
        otpLength: 6,
        expiresIn: 10 * 60,
        allowedAttempts: 5,
        storeOTP: "hashed",
        // Sign-up sends an "email-verification" OTP instead of a magic link,
        // and the default email-verification endpoint is routed through OTP.
        sendVerificationOnSignUp: true,
        overrideDefaultEmailVerification: true,
        // 3 OTP emails per minute per address (Better Auth adds the key).
        rateLimit: { window: 60, max: 3 },
        sendVerificationOTP: async ({ email, otp, type }) => {
          const actionCtx = requireActionCtx(ctx);
          await actionCtx.scheduler.runAfter(
            0,
            internal.auth.deliverAuthOtpEmail,
            {
              to: email,
              otp,
              // Change-email OTPs use the same "confirm this inbox" copy.
              type: type === "change-email" ? "email-verification" : type,
            },
          );
        },
      }),
    ],
  });
}
