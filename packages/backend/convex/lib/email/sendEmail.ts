import {
  buildOtpEmail,
  buildPasswordResetEmail,
  type AuthEmailKind,
  type EmailContent,
} from "./templates";

type EmailAddress = string | { email: string; name?: string };

export type EmailConfig = {
  accountId: string;
  apiToken: string;
  from: string;
  appName: string;
};

export type SendEmailResult =
  | { sent: true; status: number }
  | {
      sent: false;
      reason: "not-configured" | "request-failed" | "rejected" | "network-error";
      status?: number;
      detail?: string;
    };

type EmailDependencies = {
  env?: NodeJS.ProcessEnv;
  fetchImpl?: typeof fetch;
  logger?: Pick<Console, "warn" | "error">;
};

const CLOUDFLARE_EMAIL_API_BASE = "https://api.cloudflare.com/client/v4";

function deriveAccountId(env: NodeJS.ProcessEnv): string | null {
  const direct =
    env.CLOUDFLARE_ACCOUNT_ID?.trim() || env.R2_ACCOUNT_ID?.trim();
  if (direct) {
    return direct;
  }
  // Fall back to the account id embedded in the R2 S3 endpoint hostname
  // (https://<account-id>.r2.cloudflarestorage.com), which most setups
  // already configure for file uploads.
  const endpoint = env.R2_ENDPOINT?.trim();
  const match = endpoint?.match(
    /^https?:\/\/([a-f0-9]{32})\.r2\.cloudflarestorage\.com/,
  );
  return match?.[1] ?? null;
}

export function getEmailConfig(
  env: NodeJS.ProcessEnv = process.env,
): EmailConfig | null {
  const accountId = deriveAccountId(env);
  const apiToken = env.CLOUDFLARE_EMAIL_API_TOKEN?.trim();
  const from = env.AUTH_EMAIL_FROM?.trim();
  if (!accountId || !apiToken || !from) {
    return null;
  }
  return {
    accountId,
    apiToken,
    from,
    appName: env.AUTH_EMAIL_APP_NAME?.trim() || "Convex Starter",
  };
}

export function parseFromAddress(from: string): EmailAddress {
  const match = from.match(/^\s*(.+?)\s*<([^>]+)>\s*$/);
  if (!match) {
    return from.trim();
  }
  const name = match[1]!.trim().replace(/^["']|["']$/g, "");
  const email = match[2]!.trim();
  return name ? { email, name } : email;
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export async function sendCloudflareEmail(
  options: {
    to: string;
    content: EmailContent;
  },
  dependencies: EmailDependencies = {},
): Promise<SendEmailResult> {
  const env = dependencies.env ?? process.env;
  const logger = dependencies.logger ?? console;
  const fetchImpl = dependencies.fetchImpl ?? fetch;
  const config = getEmailConfig(env);

  if (!config) {
    logger.warn(
      "[email] CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_EMAIL_API_TOKEN, or AUTH_EMAIL_FROM is not configured; email was not sent",
      { to: options.to, subject: options.content.subject },
    );
    return { sent: false, reason: "not-configured" };
  }

  try {
    const response = await fetchImpl(
      `${CLOUDFLARE_EMAIL_API_BASE}/accounts/${config.accountId}/email/sending/send`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: parseFromAddress(config.from),
          to: options.to,
          subject: options.content.subject,
          html: options.content.html,
          text: options.content.text,
        }),
      },
    );

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      logger.error("[email] Cloudflare Email Sending request failed", {
        to: options.to,
        status: response.status,
        detail,
      });
      return {
        sent: false,
        reason: "request-failed",
        status: response.status,
        detail,
      };
    }

    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      // A successful send can still return a non-JSON body during tests.
    }

    const result = body as {
      success?: boolean;
      errors?: unknown;
      result?: { permanent_bounces?: string[] };
    } | null;

    if (result?.success === false) {
      logger.error("[email] Cloudflare Email Sending rejected the email", {
        to: options.to,
        errors: result.errors,
      });
      return { sent: false, reason: "rejected", status: response.status };
    }

    if (result?.result?.permanent_bounces?.includes(options.to)) {
      logger.error("[email] Email permanently bounced", { to: options.to });
    }

    return { sent: true, status: response.status };
  } catch (error) {
    logger.error("[email] Network error sending email", {
      to: options.to,
      detail: describeError(error),
    });
    return {
      sent: false,
      reason: "network-error",
      detail: describeError(error),
    };
  }
}

export async function sendAuthOtpEmail(
  options: {
    to: string;
    otp: string;
    type: AuthEmailKind;
    expiresInMinutes?: number;
  },
  dependencies: EmailDependencies = {},
): Promise<SendEmailResult> {
  const config = getEmailConfig(dependencies.env ?? process.env);
  const content = buildOtpEmail({
    type: options.type,
    otp: options.otp,
    appName: config?.appName,
    expiresInMinutes: options.expiresInMinutes,
  });
  return sendCloudflareEmail(
    { to: options.to, content },
    dependencies,
  );
}

export async function sendPasswordResetEmail(
  options: { to: string; resetUrl: string },
  dependencies: EmailDependencies = {},
): Promise<SendEmailResult> {
  const config = getEmailConfig(dependencies.env ?? process.env);
  const content = buildPasswordResetEmail({
    resetUrl: options.resetUrl,
    appName: config?.appName,
  });
  return sendCloudflareEmail(
    { to: options.to, content },
    dependencies,
  );
}
