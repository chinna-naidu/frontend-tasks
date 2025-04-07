import { promiseAll } from "../tasks/promise_all";
import { describe, it, expect } from "vitest";

describe("promiseAll", () => {
	it("should resolve with an array of values when all promises resolve", async () => {
		const promises = [
			Promise.resolve(1),
			Promise.resolve(2),
			Promise.resolve(3),
		];
		const result = await promiseAll(promises);
		expect(result).toEqual([1, 2, 3]);
	});

	it("should reject with the error when any promise rejects", async () => {
		const promises = [
			Promise.resolve(1),
			Promise.reject(new Error("Test Error")),
			Promise.resolve(3),
		];
		try {
			await promiseAll(promises);
		} catch (error: any) {
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe("Test Error");
		}
	});

	it("should resolve with an empty array when the input array is empty", async () => {
		const promises: Promise<any>[] = [];
		const result = await promiseAll(promises);
		expect(result).toEqual([]);
	});

	it("should handle promises that resolve with different types", async () => {
		const promises: Promise<any>[] = [
			Promise.resolve(1),
			Promise.resolve("hello"),
			Promise.resolve(true),
		];
		const result = await promiseAll(promises);
		expect(result).toEqual([1, "hello", true]);
	});
});
