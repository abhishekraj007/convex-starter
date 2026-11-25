"use client";

import { useEffect, useState } from "react";
import { useAction, useConvexAuth, useQuery } from "convex/react";
import { api } from "@convex-starter/backend/convex/_generated/api";
import { toast } from "@ui-sdk/react/toast";

export const EMAIL_TARGET_MODE = {
  single: "single",
  bulk: "bulk",
} as const;

export type EmailTargetMode =
  (typeof EMAIL_TARGET_MODE)[keyof typeof EMAIL_TARGET_MODE];

export const DEFAULT_SUBJECT = "A message from Convex Starter";
export const DEFAULT_BODY =
  "Hello,\n\nThis is a test email sent from the admin panel.\n\nThanks for trying Convex Starter.";

export function useAdminEmails() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const userData = useQuery(
    api.user.fetchUserAndProfile,
    isAuthenticated ? {} : "skip",
  );
  const canManageEmails =
    isAuthenticated && userData?.profile?.isAdmin === true;

  const [targetMode, setTargetMode] = useState<EmailTargetMode>(
    EMAIL_TARGET_MODE.single,
  );
  const [email, setEmail] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [body, setBody] = useState(DEFAULT_BODY);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedEmail(email.trim());
    }, 250);
    return () => clearTimeout(handle);
  }, [email]);

  const targetUser = useQuery(
    api.adminEmails.adminLookupEmailUser,
    canManageEmails && debouncedEmail ? { email: debouncedEmail } : "skip",
  );
  const audienceStats = useQuery(
    api.adminEmails.adminGetEmailAudienceStats,
    canManageEmails ? {} : "skip",
  );
  const sendEmail = useAction(api.adminEmails.adminSendEmail);
  const sendBulkEmail = useAction(api.adminEmails.adminSendBulkEmail);

  const isGateLoading =
    authLoading || (isAuthenticated && userData === undefined);
  const trimmedSubject = subject.trim();
  const trimmedBody = body.trim();
  const emailConfigured = audienceStats?.configured === true;

  const canSend =
    Boolean(trimmedSubject) &&
    Boolean(trimmedBody) &&
    emailConfigured &&
    (targetMode === EMAIL_TARGET_MODE.single
      ? Boolean(targetUser)
      : Boolean((audienceStats?.totalUsers ?? 0) > 0)) &&
    !isSending;

  const handleSend = async () => {
    if (!trimmedSubject || !trimmedBody) {
      toast.error("Subject and body are required.");
      return;
    }

    setIsSending(true);

    try {
      if (targetMode === EMAIL_TARGET_MODE.single) {
        if (!targetUser) {
          toast.error("Find a registered user before sending.");
          return;
        }

        const result = await sendEmail({
          email: targetUser.email,
          subject: trimmedSubject,
          body: trimmedBody,
        });

        if (result.sent) {
          toast.success(`Email sent to ${targetUser.email}`);
        } else if (result.reason === "not-configured") {
          toast.error(
            "Cloudflare email is not configured on the Convex deployment.",
          );
        } else {
          toast.error("Cloudflare rejected the email. Check Convex logs.");
        }

        return;
      }

      const result = await sendBulkEmail({
        subject: trimmedSubject,
        body: trimmedBody,
      });

      if (result.totalUsers === 0) {
        toast.error("No registered users to email.");
        return;
      }

      if (result.sent === 0 && result.failed === 0) {
        toast.error(
          "Cloudflare email is not configured on the Convex deployment.",
        );
        return;
      }

      if (result.failed === 0) {
        toast.success(
          `Sent ${result.sent} email(s) to ${result.totalUsers} user(s).`,
        );
      } else {
        toast.error(
          `Sent ${result.sent}, failed ${result.failed} of ${result.totalUsers}. Check Convex logs.`,
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send email.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return {
    canManageEmails,
    isGateLoading,
    targetMode,
    setTargetMode,
    email,
    setEmail,
    subject,
    setSubject,
    body,
    setBody,
    isSending,
    targetUser,
    audienceStats,
    emailConfigured,
    trimmedSubject,
    trimmedBody,
    canSend,
    handleSend,
  };
}
