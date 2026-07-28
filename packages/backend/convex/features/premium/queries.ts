import { query, mutation } from "../../_generated/server";
import * as Users from "../../model/user";
import { hasPremiumProfileGrant } from "./access";

/**
 * Read-only check if user has premium access (query - no cleanup)
 * Use this for UI display
 */
export const isPremium = query({
  args: {},
  handler: async (ctx) => {
    const userData = await Users.getUserAndProfile(ctx);
    if (!userData) {
      return { isPremium: false, reason: "Not authenticated" };
    }

    const profile = userData.profile;

    // Deterministic: do not call Date.now() in queries. Expired manual grants
    // are cleaned by checkPremiumStatus (mutation).
    if (hasPremiumProfileGrant(profile)) {
      if (profile?.premiumGrantedBy === "lifetime") {
        return { isPremium: true, grantedBy: "lifetime" };
      }

      if (profile?.premiumGrantedBy === "manual") {
        return {
          isPremium: true,
          grantedBy: "manual",
          expiresAt: profile.premiumExpiresAt,
        };
      }

      if (profile?.premiumGrantedBy === "subscription") {
        return { isPremium: true, grantedBy: "subscription" };
      }

      return { isPremium: true, grantedBy: "manual" };
    }

    const activeSubscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user_status", (q) =>
        q.eq("userId", userData.userMetadata._id).eq("status", "active"),
      )
      .first();

    if (activeSubscription) {
      return {
        isPremium: true,
        grantedBy: "subscription",
        platform: activeSubscription.platform,
      };
    }

    return { isPremium: false, reason: "No active subscription or grant" };
  },
});

/**
 * Check if user has premium access
 * Considers both manual grants and active subscriptions
 * Note: This is a mutation (not query) because it may clean up expired grants
 */
export const checkPremiumStatus = mutation({
  args: {},
  handler: async (ctx) => {
    const userData = await Users.getUserAndProfile(ctx);
    if (!userData) {
      return { isPremium: false, reason: "Not authenticated" };
    }

    const profile = userData.profile;
    const now = Date.now();

    if (profile?.isPremium) {
      if (profile.premiumGrantedBy === "lifetime") {
        return {
          isPremium: true,
          grantedBy: "lifetime",
          reason: "Lifetime access",
        };
      }

      if (profile.premiumGrantedBy === "manual") {
        if (profile.premiumExpiresAt && profile.premiumExpiresAt < now) {
          if (profile._id) {
            await ctx.db.patch(profile._id, {
              isPremium: false,
              premiumGrantedBy: undefined,
              premiumExpiresAt: undefined,
            });
          }
          return { isPremium: false, reason: "Manual grant expired" };
        }
        return {
          isPremium: true,
          grantedBy: "manual",
          expiresAt: profile.premiumExpiresAt,
          reason: "Manually granted",
        };
      }
    }

    const activeSubscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user_status", (q) =>
        q.eq("userId", userData.userMetadata._id).eq("status", "active"),
      )
      .first();

    if (activeSubscription) {
      if (
        profile &&
        (!profile.isPremium || profile.premiumGrantedBy !== "subscription")
      ) {
        await ctx.db.patch(profile._id, {
          isPremium: true,
          premiumGrantedBy: "subscription",
          premiumGrantedAt: activeSubscription.createdAt,
        });
      }
      return {
        isPremium: true,
        grantedBy: "subscription",
        platform: activeSubscription.platform,
        subscription: activeSubscription,
        reason: "Active subscription",
      };
    }

    if (
      profile &&
      profile.isPremium &&
      profile.premiumGrantedBy === "subscription"
    ) {
      await ctx.db.patch(profile._id, {
        isPremium: false,
        premiumGrantedBy: undefined,
        premiumGrantedAt: undefined,
      });
    }

    return { isPremium: false, reason: "No active subscription or grant" };
  },
});
