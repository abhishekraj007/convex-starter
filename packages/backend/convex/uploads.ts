import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import type { DataModel } from "./_generated/dataModel";
import { components, internal } from "./_generated/api";
import { R2, type R2Callbacks } from "@convex-dev/r2";
import { authComponent } from "./lib/betterAuth";
import { rateLimiter } from "./lib/rateLimit";
import {
  DEFAULT_SIGNED_URL_TTL_SECONDS,
  getSignedStorageUrl,
} from "./lib/signedStorageUrls";
import {
  assertUserScopedStorageKey,
  buildUserUploadKey,
  isUserScopedStorageKey,
} from "./lib/storageOwnership";
import {
  MAX_UPLOADS_PER_USER,
  getUserStorageQuota,
  validateUploadMetadata,
} from "./lib/uploadValidation";

// Initialize the R2 component
export const r2 = new R2(components.r2);

// Callbacks for the R2 client API
const callbacks: R2Callbacks = internal.uploads;

// Custom generateUploadUrl that embeds userId in the key
export const generateUploadUrlWithUser = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }
    await rateLimiter.limit(ctx, "uploadUrlMint", {
      key: user._id,
      throws: true,
    });
    // The key prefix is the auth user id, which lets every later read and
    // delete prove ownership without trusting a client-supplied user id.
    const key = buildUserUploadKey(user._id, crypto.randomUUID());
    return await r2.generateUploadUrl(key);
  },
});

// Generate the client API with upload callbacks.
// Only the functions we export here are part of the public API; the raw
// generated upload/delete helpers are intentionally not exported.
export const { syncMetadata, onSyncMetadata } = r2.clientApi<DataModel>({
  callbacks,
  checkUpload: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }
  },
  onUpload: async (ctx, _bucket, key) => {
    // syncMetadata takes a client-provided key, so reject anything outside
    // the caller's own namespace before any metadata work happens.
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }
    assertUserScopedStorageKey(key, user._id);
  },
  checkReadKey: async (ctx, _bucket, key) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }
    assertUserScopedStorageKey(key, user._id);
  },
  checkReadBucket: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }
  },
  checkDelete: async (ctx, _bucket, key) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }
    assertUserScopedStorageKey(key, user._id);
  },
  onSyncMetadata: async (ctx, args) => {
    // This runs after metadata sync, so r2.getMetadata will work
    // args: { bucket: string; key: string; isNew: boolean }
    const metadata = await r2.getMetadata(ctx, args.key);

    if (!metadata) {
      console.error("No metadata found for key:", args.key);
      return;
    }

    const invalidReason = validateUploadMetadata(
      metadata.contentType,
      metadata.size,
    );
    if (invalidReason) {
      console.warn(
        `[onSyncMetadata] rejecting upload ${args.key}: ${invalidReason}`,
      );
      try {
        await r2.deleteObject(ctx, args.key);
      } catch (err) {
        console.error(
          `[onSyncMetadata] failed to delete invalid upload ${args.key}:`,
          err,
        );
      }
      return;
    }

    // Extract userId from key (format: userId/uuid)
    const userId = args.key.split("/")[0];
    if (!userId || !isUserScopedStorageKey(args.key, userId)) {
      console.error("No valid userId found in key:", args.key);
      try {
        await r2.deleteObject(ctx, args.key);
      } catch {
        // Object may already be gone.
      }
      return;
    }

    // Create the upload record
    await ctx.runMutation(internal.uploads.createUploadRecord, {
      key: args.key,
      userId,
      contentType: metadata.contentType || "application/octet-stream",
      contentLength: metadata.size || 0,
    });
  },
});

// Mutation to associate an upload with the current user
export const associateUpload = mutation({
  args: {
    key: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    if (!isUserScopedStorageKey(args.key, user._id)) {
      throw new Error("Not authorized for this key");
    }

    // Get metadata from R2
    const metadata = await r2.getMetadata(ctx, args.key);
    if (!metadata) {
      throw new Error("File not found in R2");
    }

    // Check if record already exists
    const existing = await ctx.db
      .query("uploads")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (existing) {
      if (existing.userId === user._id) return;
      throw new Error("Upload already associated with another user");
    }

    const invalidReason = validateUploadMetadata(
      metadata.contentType,
      metadata.size,
    );
    if (invalidReason) {
      throw new Error(`Invalid upload: ${invalidReason}`);
    }

    await ctx.runMutation(internal.uploads.createUploadRecord, {
      key: args.key,
      userId: user._id,
      contentType: metadata.contentType || "application/octet-stream",
      contentLength: metadata.size || 0,
    });
  },
});

// Internal mutation to create upload records
export const createUploadRecord = internalMutation({
  args: {
    key: v.string(),
    userId: v.string(),
    contentType: v.string(),
    contentLength: v.number(),
    isNew: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Defense in depth: this mutation is internal, but it must still refuse a
    // key that is not namespaced under the claimed owner.
    if (!isUserScopedStorageKey(args.key, args.userId)) {
      console.error("[createUploadRecord] key/user mismatch", {
        key: args.key,
        userId: args.userId,
      });
      return;
    }

    const existing = await ctx.db
      .query("uploads")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    if (existing) {
      return;
    }

    const userProfile = await ctx.db
      .query("profile")
      .withIndex("by_auth_user_id", (q) => q.eq("authUserId", args.userId))
      .unique();

    // Uploads belong to an existing account. Without a profile we cannot
    // enforce a quota, so remove the object instead of accepting it.
    if (!userProfile) {
      console.warn(
        `[createUploadRecord] no profile for user ${args.userId}; rejecting ${args.key}`,
      );
      try {
        await r2.deleteObject(ctx, args.key);
      } catch (err) {
        console.error(
          `[createUploadRecord] failed to delete unowned upload ${args.key}:`,
          err,
        );
      }
      return;
    }

    const quota = getUserStorageQuota(userProfile.isPremium);
    const currentBytes = userProfile?.storageBytesUsed ?? 0;
    const currentCount = userProfile?.uploadCount ?? 0;

    const exceedsBytes = currentBytes + args.contentLength > quota;
    const exceedsCount = currentCount >= MAX_UPLOADS_PER_USER;
    if (exceedsBytes || exceedsCount) {
      console.warn(
        `[createUploadRecord] quota exceeded for user ${args.userId}: ` +
          `bytesUsed=${currentBytes}, incoming=${args.contentLength}, quota=${quota}, count=${currentCount}`,
      );
      try {
        await r2.deleteObject(ctx, args.key);
      } catch (err) {
        console.error(
          `[createUploadRecord] failed to delete over-quota upload ${args.key}:`,
          err,
        );
      }
      return;
    }

    await ctx.db.insert("uploads", {
      key: args.key,
      userId: args.userId,
      contentType: args.contentType,
      contentLength: args.contentLength,
      uploadedAt: Date.now(),
    });

    await ctx.db.patch(userProfile._id, {
      storageBytesUsed: currentBytes + args.contentLength,
      uploadCount: currentCount + 1,
    });
  },
});

// Query to list user's uploads
export const listUserUploads = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      return null;
    }

    const uploads = await ctx.db
      .query("uploads")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(args.limit ?? 50);

    // Generate short-lived signed URLs for each upload.
    return Promise.all(
      uploads.map(async (upload) => {
        try {
          const { url } = upload.key
            ? await getSignedStorageUrl(
                (key, options) => r2.getUrl(key, options),
                upload.key,
                DEFAULT_SIGNED_URL_TTL_SECONDS,
              )
            : { url: null };
          return {
            ...upload,
            url,
          };
        } catch (error) {
          console.error("Error getting URL for upload:", upload.key, error);
          return {
            ...upload,
            url: null,
          };
        }
      }),
    );
  },
});

// Get a single upload with URL
export const getUpload = query({
  args: {
    key: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      return null;
    }

    const upload = await ctx.db
      .query("uploads")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (!upload || upload.userId !== user._id) {
      return null;
    }

    return {
      ...upload,
      url: (
        await getSignedStorageUrl(
          (key, options) => r2.getUrl(key, options),
          upload.key,
          DEFAULT_SIGNED_URL_TTL_SECONDS,
        )
      ).url,
    };
  },
});

// Delete an upload
export const deleteUpload = mutation({
  args: {
    key: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const upload = await ctx.db
      .query("uploads")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (!upload || upload.userId !== user._id) {
      throw new Error("Upload not found");
    }
    assertUserScopedStorageKey(args.key, user._id);

    // Delete from R2
    await r2.deleteObject(ctx, args.key);

    // Delete from database
    await ctx.db.delete(upload._id);

    const userProfile = await ctx.db
      .query("profile")
      .withIndex("by_auth_user_id", (q) => q.eq("authUserId", user._id))
      .unique();
    if (userProfile) {
      await ctx.db.patch(userProfile._id, {
        storageBytesUsed: Math.max(
          0,
          (userProfile.storageBytesUsed ?? 0) - upload.contentLength,
        ),
        uploadCount: Math.max(0, (userProfile.uploadCount ?? 0) - 1),
      });
    }
  },
});
