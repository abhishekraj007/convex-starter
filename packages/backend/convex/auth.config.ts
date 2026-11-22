import type { AuthConfig } from "convex/server";
import { getAuthConfigProvider } from "@convex-dev/better-auth/auth-config";

export default {
	providers: [
		getAuthConfigProvider(),
		{
			domain: process.env.CONVEX_SITE_URL!,
			applicationID: "convex",
		},
	],
} satisfies AuthConfig;
