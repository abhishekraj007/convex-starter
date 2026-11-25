import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { authComponent, createAuth } from "./lib/betterAuth";
// import * as PolarWebhooks from "./lib/polarWebhooks";
import { handleRevenueCatWebhook } from "./lib/revenuecatWebhooks";
import { handleDodoWebhook } from "./lib/dodoWebhooks";

const http = httpRouter();

// Register Better Auth routes
authComponent.registerRoutes(http, createAuth, { cors: true });

// Register Polar webhook routes
// polar.registerRoutes(http, {
//   onSubscriptionCreated: PolarWebhooks.handleSubscriptionCreated,
//   onSubscriptionUpdated: PolarWebhooks.handleSubscriptionUpdated,
//   onProductCreated: PolarWebhooks.handleProductCreated,
//   onProductUpdated: PolarWebhooks.handleProductUpdated,
// });

// Register RevenueCat webhook route
http.route({
  path: "/revenuecat/webhooks",
  method: "POST",
  handler: handleRevenueCatWebhook,
});

// Register Dodo Payments webhook route
// Point your Dodo Payments dashboard webhook to:
// https://<your-deployment>.convex.site/dodopayments-webhook
http.route({
  path: "/dodopayments-webhook",
  method: "POST",
  handler: handleDodoWebhook,
});

export default http;
