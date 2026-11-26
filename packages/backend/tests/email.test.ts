import { describe, expect, test, vi } from "vitest";
import {
  getEmailConfig,
  parseFromAddress,
  sendAuthOtpEmail,
  sendPasswordResetEmail,
} from "../convex/lib/email/sendEmail";
import {
  buildOtpEmail,
  buildPasswordResetEmail,
} from "../convex/lib/email/templates";

const baseEnv = {
  CLOUDFLARE_ACCOUNT_ID: "account-123",
  CLOUDFLARE_EMAIL_API_TOKEN: "token-abc",
  AUTH_EMAIL_FROM: "Convex Starter <auth@example.com>",
  AUTH_EMAIL_APP_NAME: "Convex Starter",
} as NodeJS.ProcessEnv;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("Cloudflare email config", () => {
  test("returns null when any required value is missing", () => {
    expect(getEmailConfig({} as NodeJS.ProcessEnv)).toBeNull();
    expect(
      getEmailConfig({
        ...baseEnv,
        CLOUDFLARE_EMAIL_API_TOKEN: " ",
      } as NodeJS.ProcessEnv),
    ).toBeNull();
  });

  test("parses display-name senders and bare addresses", () => {
    expect(parseFromAddress("Convex Starter <auth@example.com>")).toEqual({
      email: "auth@example.com",
      name: "Convex Starter",
    });
    expect(parseFromAddress("auth@example.com")).toBe("auth@example.com");
  });
});

describe("OTP templates", () => {
  test("includes the code and purpose in HTML and text", () => {
    const content = buildOtpEmail({
      type: "email-verification",
      otp: "123456",
      expiresInMinutes: 10,
    });

    expect(content.subject).toContain("Verify your");
    expect(content.html).toContain("123456");
    expect(content.html).toContain("Verify your email address");
    expect(content.text).toContain("Code: 123456");
    expect(content.text).toContain("10 minutes");
  });

  test("uses a distinct subject for password resets", () => {
    const content = buildOtpEmail({
      type: "forget-password",
      otp: "987654",
    });
    expect(content.subject).toBe("Reset your Convex Starter password");
    expect(content.text).toContain("987654");
  });

  test("escapes the reset URL in HTML", () => {
    const content = buildPasswordResetEmail({
      resetUrl: "https://example.com/reset?token=a&b=<c>",
    });
    expect(content.html).toContain(
      "https://example.com/reset?token=a&amp;b=&lt;c&gt;",
    );
  });
});

describe("sendAuthOtpEmail", () => {
  test("does not call fetch when configuration is missing", async () => {
    const fetchImpl = vi.fn<typeof fetch>();
    const logger = { warn: vi.fn(), error: vi.fn() };

    const result = await sendAuthOtpEmail(
      { to: "user@example.com", otp: "123456", type: "sign-in" },
      { env: {} as NodeJS.ProcessEnv, fetchImpl, logger },
    );

    expect(result).toEqual({ sent: false, reason: "not-configured" });
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledOnce();
  });

  test("posts a Cloudflare Email Sending payload", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () =>
      jsonResponse({ success: true, result: { queued: ["user@example.com"] } }),
    );
    const logger = { warn: vi.fn(), error: vi.fn() };

    const result = await sendAuthOtpEmail(
      {
        to: "user@example.com",
        otp: "246810",
        type: "forget-password",
      },
      { env: baseEnv, fetchImpl, logger },
    );

    expect(result).toEqual({ sent: true, status: 200 });
    expect(fetchImpl).toHaveBeenCalledOnce();

    const [url, init] = fetchImpl.mock.calls[0]!;
    expect(url).toBe(
      "https://api.cloudflare.com/client/v4/accounts/account-123/email/sending/send",
    );
    expect(init?.method).toBe("POST");
    expect(init?.headers).toMatchObject({
      Authorization: "Bearer token-abc",
      "Content-Type": "application/json",
    });

    const body = JSON.parse(String(init?.body)) as {
      from: unknown;
      to: string;
      subject: string;
      html: string;
      text: string;
    };
    expect(body.from).toEqual({
      email: "auth@example.com",
      name: "Convex Starter",
    });
    expect(body.to).toBe("user@example.com");
    expect(body.subject).toBe("Reset your Convex Starter password");
    expect(body.html).toContain("246810");
    expect(body.text).toContain("Code: 246810");
    expect(logger.error).not.toHaveBeenCalled();
  });

  test("reports a failed Cloudflare response without throwing", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () =>
      new Response("bad token", { status: 403 }),
    );
    const logger = { warn: vi.fn(), error: vi.fn() };

    const result = await sendAuthOtpEmail(
      { to: "user@example.com", otp: "123456", type: "sign-in" },
      { env: baseEnv, fetchImpl, logger },
    );

    expect(result).toMatchObject({
      sent: false,
      reason: "request-failed",
      status: 403,
    });
    expect(logger.error).toHaveBeenCalledOnce();
  });

  test("reports a network error without throwing", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => {
      throw new Error("dns failure");
    });
    const logger = { warn: vi.fn(), error: vi.fn() };

    const result = await sendPasswordResetEmail(
      { to: "user@example.com", resetUrl: "https://example.com/reset" },
      { env: baseEnv, fetchImpl, logger },
    );

    expect(result).toMatchObject({
      sent: false,
      reason: "network-error",
      detail: "dns failure",
    });
    expect(logger.error).toHaveBeenCalledOnce();
  });
});
