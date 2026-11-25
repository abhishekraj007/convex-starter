export type AuthEmailKind =
  | "sign-in"
  | "email-verification"
  | "forget-password";

export type EmailContent = {
  subject: string;
  html: string;
  text: string;
};

const DEFAULT_APP_NAME = "Convex Starter";
const DEFAULT_EXPIRES_IN_MINUTES = 10;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function shell(options: {
  appName: string;
  heading: string;
  intro: string;
  code: string;
  expiresInMinutes: number;
  footer: string;
}): string {
  const appName = escapeHtml(options.appName);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(options.heading)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1c1917;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;background-color:#ffffff;border:1px solid #e7e5e4;border-radius:12px;padding:32px;">
            <tr>
              <td>
                <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#78716c;">${appName}</p>
                <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;color:#1c1917;">${escapeHtml(options.heading)}</h1>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#44403c;">${escapeHtml(options.intro)}</p>
                <div style="margin:0 0 24px;padding:20px;border-radius:10px;background-color:#fafaf9;border:1px solid #e7e5e4;text-align:center;">
                  <span style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:32px;font-weight:700;letter-spacing:0.35em;color:#1c1917;">${escapeHtml(options.code)}</span>
                </div>
                <p style="margin:0 0 24px;font-size:13px;line-height:1.6;color:#78716c;">This code expires in ${options.expiresInMinutes} minutes. If you did not request it, you can safely ignore this email.</p>
                <p style="margin:0;padding-top:20px;border-top:1px solid #e7e5e4;font-size:12px;line-height:1.6;color:#a8a29e;">${escapeHtml(options.footer)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildOtpEmail(options: {
  type: AuthEmailKind;
  otp: string;
  appName?: string;
  expiresInMinutes?: number;
}): EmailContent {
  const appName = options.appName ?? DEFAULT_APP_NAME;
  const expiresInMinutes =
    options.expiresInMinutes ?? DEFAULT_EXPIRES_IN_MINUTES;

  const copy = {
    "sign-in": {
      heading: "Your sign-in code",
      intro: `Use this one-time code to sign in to ${appName}.`,
      subject: `${options.otp} is your ${appName} sign-in code`,
      footer: `If this was not you, no action is needed. Your account has not been accessed.`,
    },
    "email-verification": {
      heading: "Verify your email address",
      intro: `Enter this code to finish setting up your ${appName} account.`,
      subject: `Verify your ${appName} email`,
      footer: `If you did not create an account, you can ignore this email.`,
    },
    "forget-password": {
      heading: "Reset your password",
      intro: `Use this one-time code to choose a new password for your ${appName} account.`,
      subject: `Reset your ${appName} password`,
      footer: `If you did not ask to reset your password, you can ignore this email.`,
    },
  }[options.type];

  return {
    subject: copy.subject,
    html: shell({
      appName,
      heading: copy.heading,
      intro: copy.intro,
      code: options.otp,
      expiresInMinutes,
      footer: copy.footer,
    }),
    text: [
      copy.heading,
      "",
      copy.intro,
      "",
      `Code: ${options.otp}`,
      "",
      `This code expires in ${expiresInMinutes} minutes.`,
      copy.footer,
    ].join("\n"),
  };
}

export function buildPasswordResetEmail(options: {
  resetUrl: string;
  appName?: string;
}): EmailContent {
  const appName = options.appName ?? DEFAULT_APP_NAME;
  const url = escapeHtml(options.resetUrl);

  return {
    subject: `Reset your ${appName} password`,
    html: `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
  <body style="margin:0;padding:32px 16px;background-color:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1c1917;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;background-color:#ffffff;border:1px solid #e7e5e4;border-radius:12px;padding:32px;">
          <tr><td>
            <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#78716c;">${escapeHtml(appName)}</p>
            <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;">Reset your password</h1>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#44403c;">We received a request to reset the password for your ${escapeHtml(appName)} account. Choose a new password using the button below.</p>
            <p style="margin:0 0 24px;">
              <a href="${url}" style="display:inline-block;padding:12px 20px;border-radius:8px;background-color:#1c1917;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">Reset password</a>
            </p>
            <p style="margin:0 0 24px;font-size:13px;line-height:1.6;color:#78716c;">This link expires in one hour. If you did not request a reset, you can ignore this email.</p>
            <p style="margin:0;padding-top:20px;border-top:1px solid #e7e5e4;font-size:12px;line-height:1.6;color:#a8a29e;">If the button does not work, copy this link into your browser:<br /><span style="word-break:break-all;">${url}</span></p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`,
    text: [
      `Reset your ${appName} password`,
      "",
      "Open this link to choose a new password:",
      options.resetUrl,
      "",
      "This link expires in one hour.",
      "If you did not request a reset, you can ignore this email.",
    ].join("\n"),
  };
}
export function buildAdminEmail(options: {
  subject: string;
  body: string;
  appName?: string;
}): EmailContent {
  const appName = options.appName ?? DEFAULT_APP_NAME;
  const paragraphs = options.body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  const paragraphsHtml = paragraphs
    .map(
      (paragraph) =>
        `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#44403c;">${escapeHtml(
          paragraph,
        ).replaceAll("\n", "<br />")}</p>`,
    )
    .join("\n");

  return {
    subject: options.subject,
    html: `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
  <body style="margin:0;padding:32px 16px;background-color:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1c1917;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;background-color:#ffffff;border:1px solid #e7e5e4;border-radius:12px;padding:32px;">
          <tr><td>
            <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#78716c;">${escapeHtml(appName)}</p>
            <h1 style="margin:0 0 20px;font-size:22px;line-height:1.3;color:#1c1917;">${escapeHtml(options.subject)}</h1>
            ${paragraphsHtml}
            <p style="margin:24px 0 0;padding-top:20px;border-top:1px solid #e7e5e4;font-size:12px;line-height:1.6;color:#a8a29e;">You are receiving this email because you have an account with ${escapeHtml(appName)}.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`,
    text: [options.subject, "", options.body].join("\n"),
  };
}
