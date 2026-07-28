/**
 * Validates the Polar webhook secret passed from the signed Next.js route.
 * Every Polar-facing public Convex action must call this before any work.
 */
export function assertPolarWebhookSecret(webhookSecret: string): void {
  const expectedSecret = process.env.POLAR_WEBHOOK_SECRET;
  if (!expectedSecret || webhookSecret !== expectedSecret) {
    throw new Error("UNAUTHORIZED_WEBHOOK");
  }
}
