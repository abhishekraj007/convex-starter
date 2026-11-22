// src/lib/polar-client.ts
import { createPolar } from "@polar-sh/sdk/2026-10";

const environment =
  process.env.POLAR_SERVER === "production" ? "production" : "sandbox";

export const api = createPolar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  environment,
});
