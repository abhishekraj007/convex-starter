import { describe, expect, test } from "vitest";
import {
  buildUserUploadKey,
  assertUserScopedStorageKey,
  isUserScopedStorageKey,
} from "../convex/lib/storageOwnership";
import {
  DEFAULT_SIGNED_URL_TTL_SECONDS,
  MAX_SIGNED_URL_TTL_SECONDS,
  clampSignedUrlTtl,
  getSignedStorageUrl,
} from "../convex/lib/signedStorageUrls";

describe("R2 upload key ownership", () => {
  test("builds keys under the authenticated user id", () => {
    expect(buildUserUploadKey("user_123", "object-1")).toBe(
      "user_123/object-1",
    );
  });

  test("rejects separators in ids", () => {
    expect(() => buildUserUploadKey("user/123", "object-1")).toThrow();
    expect(() => buildUserUploadKey("user_123", "a/b")).toThrow();
  });

  test("accepts only keys with the exact owner prefix", () => {
    expect(isUserScopedStorageKey("user_123/object-1", "user_123")).toBe(true);
    expect(isUserScopedStorageKey("user_123/object-1", "user_12")).toBe(false);
    expect(isUserScopedStorageKey("user_1234/object-1", "user_123")).toBe(
      false,
    );
    expect(isUserScopedStorageKey("user_123", "user_123")).toBe(false);
    expect(isUserScopedStorageKey("user_123/", "user_123")).toBe(false);
    expect(isUserScopedStorageKey("/object-1", "user_123")).toBe(false);
  });

  test("assert throws for another user's key", () => {
    expect(() =>
      assertUserScopedStorageKey("other/object-1", "user_123"),
    ).toThrow("Not authorized for this storage key");
    expect(() =>
      assertUserScopedStorageKey("user_123/object-1", "user_123"),
    ).not.toThrow();
  });
});

describe("signed R2 URLs", () => {
  test("clamps TTL to the R2 maximum", () => {
    expect(clampSignedUrlTtl(undefined)).toBe(DEFAULT_SIGNED_URL_TTL_SECONDS);
    expect(clampSignedUrlTtl(0)).toBe(1);
    expect(clampSignedUrlTtl(Number.NaN)).toBe(
      DEFAULT_SIGNED_URL_TTL_SECONDS,
    );
    expect(clampSignedUrlTtl(MAX_SIGNED_URL_TTL_SECONDS * 2)).toBe(
      MAX_SIGNED_URL_TTL_SECONDS,
    );
  });

  test("passes the clamped expiry to the signer", async () => {
    const seen: Array<{ key: string; expiresIn: number }> = [];
    const result = await getSignedStorageUrl(
      async (key, options) => {
        seen.push({ key, expiresIn: options.expiresIn });
        return "https://cdn.example.com/file";
      },
      "user_123/object-1",
      120,
    );

    expect(result).toEqual({
      url: "https://cdn.example.com/file",
      expiresInSeconds: 120,
    });
    expect(seen).toEqual([{ key: "user_123/object-1", expiresIn: 120 }]);
  });
});
