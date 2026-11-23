# Auth email and R2 storage

This starter uses Better Auth (through `@convex-dev/better-auth`) for email + password, email OTP, and social sign-in. File uploads use Cloudflare R2 through `@convex-dev/r2`.

All secrets live on the Convex deployment, not in the Next.js or Expo apps. Client apps only need `NEXT_PUBLIC_CONVEX_URL` / `NEXT_PUBLIC_CONVEX_SITE_URL` (or `EXPO_PUBLIC_*`).

## 1. Cloudflare Email Sending

Better Auth sends three kinds of OTP from the backend:

| Purpose | Trigger | Better Auth type |
| --- | --- | --- |
| Sign in with a one-time code | "Use email OTP" on the auth screen | `sign-in` |
| Verify a new email/password account | After sign-up | `email-verification` |
| Reset a forgotten password | Forgot-password screen | `forget-password` |

### Onboard a sending domain

1. In the Cloudflare dashboard, open **Email > Email Sending**.
2. Add and verify the domain you want to send from. Cloudflare will show the DNS records to add.
3. Wait for the domain status to become active.
4. Use an address on that domain for `AUTH_EMAIL_FROM`, for example:
   `Convex Starter <noreply@yourdomain.com>`.

### Create an API token

1. Go to **My Profile > API Tokens > Create Token**.
2. Use a custom token with **Account > Email Sending > Edit** (some accounts expose this as **Account > Email Service > Edit**).
3. Restrict the token to the account that owns the domain.
4. Copy the token once; it is shown only at creation time.

### Configure the Convex deployment

```bash
npx convex env set CLOUDFLARE_ACCOUNT_ID <account_id>
npx convex env set CLOUDFLARE_EMAIL_API_TOKEN <api_token>
npx convex env set AUTH_EMAIL_FROM "Convex Starter <noreply@yourdomain.com>"
# Optional display name used in email copy
npx convex env set AUTH_EMAIL_APP_NAME "Convex Starter"
```

The account id is visible in the Cloudflare dashboard sidebar, or in any zone's **Overview** page.

If any of `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_EMAIL_API_TOKEN`, or `AUTH_EMAIL_FROM` is missing, the helper logs a warning and returns without throwing. Auth requests still succeed; this is intentional so local development works without email credentials. Check the Convex logs to see the OTP during development.

### How the flow is wired

- `packages/backend/convex/lib/betterAuth/createAuth.ts` enables `emailAndPassword` and the Better Auth `emailOTP` plugin.
- New accounts must verify their email before a session is issued (`requireEmailVerification: true`).
- OTPs are 6 digits, valid for 10 minutes, stored hashed, and limited to 5 attempts.
- The plugin rate-limits OTP endpoints to 3 requests per minute per key. Better Auth's general rate limiter is also enabled.
- `sendVerificationOTP` schedules `internal.auth.deliverAuthOtpEmail` so the HTTP auth request returns immediately. The email helper never throws.
- `sendResetPassword` (link-based fallback) schedules `internal.auth.deliverPasswordResetEmail`. The UI uses OTP reset instead.

Email templates live in `packages/backend/convex/lib/email/templates.ts`. Change the app name with `AUTH_EMAIL_APP_NAME`.

## 2. Cloudflare R2

### Create a bucket

1. In the Cloudflare dashboard, open **R2 > Create bucket**.
2. Note the bucket name and the S3 endpoint:
   `https://<account_id>.r2.cloudflarestorage.com`.
3. Create an R2 API token with **Object Read & Write** for that bucket. Note the access key id and secret access key.
4. Create a Cloudflare API token with R2 permissions for `R2_TOKEN` if you use account-level tooling.

### Bucket CORS

The browser uploads directly to a presigned URL with `PUT`, then the app reads through signed `GET` URLs. Add a CORS rule for every web/admin origin:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3004",
      "http://localhost:3015",
      "https://your-web-domain.example",
      "https://your-admin-domain.example"
    ],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedHeaders": ["content-type"],
    "ExposeHeaders": ["etag"],
    "MaxAgeSeconds": 3600
  }
]
```

### Configure the Convex deployment

```bash
npx convex env set R2_BUCKET <bucket_name>
npx convex env set R2_ENDPOINT https://<account_id>.r2.cloudflarestorage.com
npx convex env set R2_ACCESS_KEY_ID <access_key_id>
npx convex env set R2_SECRET_ACCESS_KEY <secret_access_key>
npx convex env set R2_TOKEN <cloudflare_api_token>
```

### Ownership model

- Upload keys are always `<authUserId>/<uuid>` (`buildUserUploadKey`).
- Every public function derives the user from `ctx.auth` through `authComponent.safeGetAuthUser(ctx)`; client-supplied user ids are never trusted.
- `syncMetadata` runs `onUpload`, which rejects keys outside the caller's prefix before metadata work starts.
- `associateUpload`, `getUpload`, and `deleteUpload` assert the same prefix and check the database row owner.
- Signed read URLs default to 1 hour and are clamped to R2's 7-day maximum.
- Upload validation accepts JPEG, PNG, and WebP up to 10 MB. Rejected or over-quota objects are deleted from R2.
- The raw generated `generateUploadUrl` and `deleteObject` functions are deliberately not exported. Only `generateUploadUrlWithUser`, `syncMetadata`, and `onSyncMetadata` are public.

## 3. Client routes

Web (`apps/web`):

- `/auth` – sign in or sign up (email/password + Google)
- `/auth/verify-otp` – email verification or OTP sign-in
- `/auth/forgot-password` – request a reset code
- `/auth/reset-password` – enter the code and a new password
- `/uploads` – upload, preview, and delete images

Admin (`apps/admin`):

- `/` – admin sign in
- `/auth/sign-up`, `/auth/verify-otp`, `/auth/forgot-password`, `/auth/reset-password`
- `/uploads` – same demo with admin chrome

Native (`apps/native`):

- `/(root)/(auth)` – landing with Google, Apple, and Continue with Email
- `/(root)/(auth)/email`, `verify-otp`, `forgot-password`, `reset-password`
- `/(root)/(main)/uploads`

Admin users still need `profile.isAdmin === true` in Convex. Creating an admin account does not grant admin access.

## 4. Tests

```bash
pnpm -F @convex-starter/backend test
```

The test suite covers:

- Email config validation, sender parsing, OTP/reset templates, and Cloudflare API calls with a mocked `fetch`.
- Graceful handling of missing config, non-2xx responses, and network errors.
- R2 ownership helpers and signed URL TTL clamping.
- `internal.uploads.createUploadRecord` with `convex-test`: owner prefix enforcement, quota counters, and idempotency.
