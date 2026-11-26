/**
 * Whether new email/password accounts must verify their inbox with an OTP
 * before a session is issued. Enabled by default; disable explicitly for
 * local development or demos with:
 *
 *   npx convex env set AUTH_REQUIRE_EMAIL_VERIFICATION false
 *
 * Social providers are unaffected either way. Keep this enabled in
 * production — without it, anyone can register with any email address.
 */
export function isEmailVerificationRequired(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return env.AUTH_REQUIRE_EMAIL_VERIFICATION !== "false";
}
