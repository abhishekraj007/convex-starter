import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
	...nextVitals,
	{
		rules: {
			// Docs pages contain prose with unescaped quotes/apostrophes.
			"react/no-unescaped-entities": "off",
			// Existing client-only hydration flows intentionally sync state from
			// browser APIs inside effects.
			"react-hooks/set-state-in-effect": "off",
		},
	},
	globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
