import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "jsdom", // Use jsdom for browser-like environment
		// You might want to add setup files here if needed
		setupFiles: "./src/tests/setupTests.ts",
	},
});
