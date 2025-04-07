import { describe, test, vi, expect, beforeEach, afterEach } from "vitest";
import { throttleFn } from "../tasks/throttle";

describe("throttleFn", () => {
	test("should call the function immediately on the first call", () => {
		const func = vi.fn();
		const throttledFunc = throttleFn(func, 100);

		throttledFunc();

		expect(func).toHaveBeenCalledTimes(1);
	});

	test("should not call the function again within the throttle interval", () => {
		const func = vi.fn();
		const throttledFunc = throttleFn(func, 100);

		throttledFunc(); // First call
		vi.advanceTimersByTime(50);
		throttledFunc(); // Second call within interval

		expect(func).toHaveBeenCalledTimes(1);
	});

	test("should allow a call exactly when the throttle interval ends", () => {
		const func = vi.fn();
		const throttledFunc = throttleFn(func, 100);

		throttledFunc(); // First call
		expect(func).toHaveBeenCalledTimes(1);

		vi.advanceTimersByTime(99); // Advance close to the end
		throttledFunc(); // Second call within interval - should be ignored
		expect(func).toHaveBeenCalledTimes(1);

		vi.advanceTimersByTime(1); // Total time = 100ms. Timer callback runs, timeout becomes null.
		throttledFunc(); // Third call exactly at the end of the interval. Should execute.
		expect(func).toHaveBeenCalledTimes(2); // Expect the second call now

		// A new timeout was set by the third call.
		vi.advanceTimersByTime(99);
		throttledFunc(); // Fourth call within the new interval - should be ignored
		expect(func).toHaveBeenCalledTimes(2);
	});

	test("should call the function again exactly after the throttle interval passes if called during interval", () => {
		const func = vi.fn();
		const throttledFunc = throttleFn(func, 100);

		throttledFunc(); // First call
		expect(func).toHaveBeenCalledTimes(1);

		vi.advanceTimersByTime(50);
		throttledFunc(); // Second call within interval - should be ignored
		expect(func).toHaveBeenCalledTimes(1);

		vi.advanceTimersByTime(50); // Total time = 100ms, timeout should clear now
		// No call here, let the timeout clear

		throttledFunc(); // Third call, after timeout cleared
		expect(func).toHaveBeenCalledTimes(2); // Should be called now
	});

	test("should pass arguments correctly to the original function", () => {
		const func = vi.fn();
		const throttledFunc = throttleFn(func, 100);
		const args = [1, "test", { key: "value" }];

		throttledFunc(...args);

		expect(func).toHaveBeenCalledWith(...args);
	});

	test("should execute subsequent calls after the delay if called multiple times within the delay", () => {
		const func = vi.fn();
		const throttledFunc = throttleFn(func, 100);

		// First call
		throttledFunc(1);
		expect(func).toHaveBeenCalledTimes(1);
		expect(func).toHaveBeenLastCalledWith(1);

		// Calls within the throttle period
		vi.advanceTimersByTime(50);
		throttledFunc(2);
		vi.advanceTimersByTime(30);
		throttledFunc(3);

		// Still only 1 call expected
		expect(func).toHaveBeenCalledTimes(1);

		// Advance time past the throttle period
		vi.advanceTimersByTime(20); // Total 100ms passed since first call's timeout started
		// Timeout should have cleared now

		// This call should execute
		throttledFunc(4);
		expect(func).toHaveBeenCalledTimes(2);
		expect(func).toHaveBeenLastCalledWith(4);

		// Advance time again
		vi.advanceTimersByTime(100);

		// This call should also execute
		throttledFunc(5);
		expect(func).toHaveBeenCalledTimes(3);
		expect(func).toHaveBeenLastCalledWith(5);
	});
});
