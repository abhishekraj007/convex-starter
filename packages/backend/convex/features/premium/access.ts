import type { Doc } from "../../_generated/dataModel";

/**
 * Whether the profile grant currently confers premium.
 *
 * When `now` is omitted (query path), manual grants are trusted from the
 * `isPremium` flag so queries stay deterministic. Mutations that clean up
 * expired grants should pass `Date.now()`.
 */
export function hasPremiumProfileGrant(
  profile: Doc<"profile"> | null | undefined,
  now?: number,
): boolean {
  if (!profile?.isPremium) {
    return false;
  }

  if (
    profile.premiumGrantedBy === "lifetime" ||
    profile.premiumGrantedBy === "subscription"
  ) {
    return true;
  }

  if (profile.premiumGrantedBy === "manual") {
    if (now === undefined) {
      return true;
    }
    return !profile.premiumExpiresAt || profile.premiumExpiresAt >= now;
  }

  return true;
}
