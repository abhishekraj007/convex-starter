import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./lib/betterAuth";
import { dodoWebhookHandler } from "./lib/dodoWebhooks";
import { handleRevenueCatWebhook } from "./lib/revenuecatWebhooks";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth, { cors: true });

http.route({
  path: "/dodopayments-webhook",
  method: "POST",
  handler: dodoWebhookHandler,
});

http.route({
  path: "/revenuecat/webhooks",
  method: "POST",
  handler: handleRevenueCatWebhook,
});

export default http;
