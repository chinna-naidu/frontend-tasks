import { describe, it, expect, vi } from "vitest";
import { debounceFn } from "../tasks/debounce";

describe("debounceFn", () => {
	it("should not call the function immediately", () => {
		const func = vi.fn();
		const debouncedFunc = debounceFn(func, 100);

		debouncedFunc();

		expect(func).not.toHaveBeenCalled();
	});

	it("should call the function after the specified delay", () => {
		const func = vi.fn();
		const debouncedFunc = debounceFn(func, 100);

		debouncedFunc();
		expect(func).not.toHaveBeenCalled(); // Still not called yet

		vi.advanceTimersByTime(100); // Advance time by the delay
		expect(func).toHaveBeenCalledTimes(1);
	});

	it("should only call the function once after multiple calls within the delay", () => {
		const func = vi.fn();
		const debouncedFunc = debounceFn(func, 100);

		debouncedFunc(); // Call 1
		vi.advanceTimersByTime(50);
		debouncedFunc(); // Call 2 (resets the timer)
		vi.advanceTimersByTime(50);
		debouncedFunc(); // Call 3 (resets the timer again)

		expect(func).not.toHaveBeenCalled(); // Not called yet

		vi.advanceTimersByTime(100); // Advance time past the last call's delay
		expect(func).toHaveBeenCalledTimes(1); // Should have been called only once
	});

	it("should call the function with the latest arguments", () => {
		const func = vi.fn();
		const debouncedFunc = debounceFn(func, 100);

		debouncedFunc(1);
		vi.advanceTimersByTime(50);
		debouncedFunc(2); // This call's arguments should be used

		vi.advanceTimersByTime(100);
		expect(func).toHaveBeenCalledTimes(1);
		expect(func).toHaveBeenCalledWith(2); // Check if called with the last arguments
	});

	it("should work with multiple arguments", () => {
		const func = vi.fn();
		const debouncedFunc = debounceFn(func, 100);

		debouncedFunc("a", 1);
		vi.advanceTimersByTime(50);
		debouncedFunc("b", 2); // Latest arguments

		vi.advanceTimersByTime(100);
		expect(func).toHaveBeenCalledTimes(1);
		expect(func).toHaveBeenCalledWith("b", 2);
	});

	it("should allow subsequent calls after the delay has passed", () => {
		const func = vi.fn();
		const debouncedFunc = debounceFn(func, 100);

		// First call sequence
		debouncedFunc(1);
		vi.advanceTimersByTime(100);
		expect(func).toHaveBeenCalledTimes(1);
		expect(func).toHaveBeenCalledWith(1);

		// Second call sequence after delay
		debouncedFunc(2);
		expect(func).toHaveBeenCalledTimes(1); // Not called immediately
		vi.advanceTimersByTime(100);
		expect(func).toHaveBeenCalledTimes(2); // Called again
		expect(func).toHaveBeenCalledWith(2);
	});
});
