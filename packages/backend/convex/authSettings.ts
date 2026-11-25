import { query } from "./_generated/server";
import { isEmailVerificationRequired } from "./lib/authFlags";

/**
 * Public, non-sensitive auth behavior flags so clients can adapt signup
 * flows (e.g. whether to route to OTP verification after email signup).
 */
export const getAuthSettings = query({
  args: {},
  handler: async () => {
    return {
      requireEmailVerification: isEmailVerificationRequired(),
    };
  },
});
