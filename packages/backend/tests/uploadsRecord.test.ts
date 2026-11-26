import { describe, expect, test } from "vitest";
import { convexTest } from "convex-test";
import schema from "../convex/schema";
import { internal } from "../convex/_generated/api";

const modules = import.meta.glob("../convex/**/*.ts");

const userId = "user_test_1";

async function setup() {
  const t = convexTest(schema, modules);
  await t.run(async (ctx) => {
    await ctx.db.insert("profile", {
      authUserId: userId,
      email: "owner@example.com",
      name: "Owner",
      isPremium: false,
    });
  });
  return t;
}

describe("uploads.createUploadRecord", () => {
  test("counts an upload owned by the user", async () => {
    const t = await setup();

    await t.mutation(internal.uploads.createUploadRecord, {
      key: `${userId}/object-1`,
      userId,
      contentType: "image/png",
      contentLength: 1024,
    });

    const { uploads, profile } = await t.run(async (ctx) => ({
      uploads: await ctx.db.query("uploads").collect(),
      profile: await ctx.db.query("profile").first(),
    }));

    expect(uploads).toHaveLength(1);
    expect(uploads[0]).toMatchObject({
      key: `${userId}/object-1`,
      userId,
      contentLength: 1024,
    });
    expect(profile?.storageBytesUsed).toBe(1024);
    expect(profile?.uploadCount).toBe(1);
  });

  test("refuses a key owned by a different user", async () => {
    const t = await setup();

    await t.mutation(internal.uploads.createUploadRecord, {
      key: `another-user/object-1`,
      userId,
      contentType: "image/png",
      contentLength: 1024,
    });

    const { uploads, profile } = await t.run(async (ctx) => ({
      uploads: await ctx.db.query("uploads").collect(),
      profile: await ctx.db.query("profile").first(),
    }));

    expect(uploads).toHaveLength(0);
    expect(profile?.storageBytesUsed).toBeUndefined();
    expect(profile?.uploadCount).toBeUndefined();
  });

  test("is idempotent for a repeated key", async () => {
    const t = await setup();
    const args = {
      key: `${userId}/object-1`,
      userId,
      contentType: "image/png",
      contentLength: 1024,
    };

    await t.mutation(internal.uploads.createUploadRecord, args);
    await t.mutation(internal.uploads.createUploadRecord, args);

    const { uploads, profile } = await t.run(async (ctx) => ({
      uploads: await ctx.db.query("uploads").collect(),
      profile: await ctx.db.query("profile").first(),
    }));

    expect(uploads).toHaveLength(1);
    expect(profile?.storageBytesUsed).toBe(1024);
    expect(profile?.uploadCount).toBe(1);
  });
});
