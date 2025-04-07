import { vi, beforeEach, afterEach } from "vitest";

// Enable fake timers before each test
beforeEach(() => {
	vi.useFakeTimers();
});

// Restore real timers after each test
afterEach(() => {
	vi.useRealTimers();
});
