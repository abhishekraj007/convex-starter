"use client";

import { useQuery } from "convex/react";
import { api } from "@convex-starter/backend/convex/_generated/api";

// Mirrors the storage limits enforced by the upload flow in the backend.
const STORAGE_QUOTA_BYTES = {
  free: 500 * 1024 * 1024,
  premium: 5 * 1024 * 1024 * 1024,
};

export function useDashboardOverview() {
  const userData = useQuery(api.user.fetchUserAndProfile);
  const creditsData = useQuery(api.features.credits.queries.getUserCredits);
  const premiumStatus = useQuery(api.features.premium.queries.isPremium);
  const uploads = useQuery(api.uploads.listUserUploads, { limit: 4 });

  const profile = userData?.profile;
  const displayName = profile?.name || userData?.userMetadata?.name;
  const firstName = displayName?.trim().split(/\s+/)[0];
  const isPremium = Boolean(premiumStatus?.isPremium ?? profile?.isPremium);
  const credits = creditsData?.credits ?? profile?.credits ?? 0;
  const uploadCount = profile?.uploadCount ?? uploads?.length ?? 0;
  const storageBytes = profile?.storageBytesUsed ?? 0;
  const storageQuota = isPremium ? STORAGE_QUOTA_BYTES.premium : STORAGE_QUOTA_BYTES.free;
  const storagePercent = Math.min(100, Math.round((storageBytes / storageQuota) * 100));
  const isLoading =
    userData === undefined ||
    creditsData === undefined ||
    premiumStatus === undefined ||
    uploads === undefined;

  return {
    firstName,
    isPremium,
    credits,
    uploadCount,
    storageBytes,
    storageQuota,
    storagePercent,
    recentUploads: uploads ?? [],
    isLoading,
  };
}

