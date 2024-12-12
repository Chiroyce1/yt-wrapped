import type { Config } from "@sveltejs/adapter-vercel";

export const config: Config = {
	runtime: "nodejs20.x",
};

import { dev } from "$app/environment";
import { injectAnalytics } from "@vercel/analytics/sveltekit";

injectAnalytics({ mode: dev ? "development" : "production" });
