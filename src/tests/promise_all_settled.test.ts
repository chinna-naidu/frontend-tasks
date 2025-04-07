import { promiseAllSettled } from "../tasks/promise_all_settled";
import { describe, it, expect } from "vitest";

describe("promiseAllSettled", () => {
	it("should resolve with an array of fulfilled results when all promises resolve", async () => {
		const promises = [
			Promise.resolve(1),
			Promise.resolve(2),
			Promise.resolve(3),
		];
		const result = await promiseAllSettled(promises);
		expect(result).toEqual([
			{ status: "fulfilled", value: 1 },
			{ status: "fulfilled", value: 2 },
			{ status: "fulfilled", value: 3 },
		]);
	});

	it("should resolve with an array of rejected results when all promises reject", async () => {
		const promises = [
			Promise.reject(new Error("Error 1")),
			Promise.reject(new Error("Error 2")),
		];
		const result = await promiseAllSettled(promises);
		expect(result).toEqual([
			{ status: "rejected", reason: new Error("Error 1") },
			{ status: "rejected", reason: new Error("Error 2") },
		]);
	});

	it("should resolve with an array of mixed fulfilled and rejected results", async () => {
		const promises = [
			Promise.resolve(1),
			Promise.reject(new Error("Error 1")),
			Promise.resolve(3),
		];
		const result = await promiseAllSettled(promises);
		expect(result).toEqual([
			{ status: "fulfilled", value: 1 },
			{ status: "rejected", reason: new Error("Error 1") },
			{ status: "fulfilled", value: 3 },
		]);
	});

	it("should resolve with an empty array when the input array is empty", async () => {
		const promises: Promise<any>[] = [];
		const result = await promiseAllSettled(promises);
		expect(result).toEqual([]);
	});

	it("should handle promises that resolve with different types", async () => {
		const promises: Promise<any>[] = [
			Promise.resolve(1),
			Promise.resolve("hello"),
			Promise.resolve(true),
		];
		const result = await promiseAllSettled(promises);
		expect(result).toEqual([
			{ status: "fulfilled", value: 1 },
			{ status: "fulfilled", value: "hello" },
			{ status: "fulfilled", value: true },
		]);
	});
});
