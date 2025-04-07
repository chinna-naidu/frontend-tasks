import { describe, it, expect } from "vitest";
import { promiseAny } from "../../src/tasks/promise_any";
// import type AggError from "es-aggregate-error";

describe("promiseAny", () => {
	it("resolves with the first resolved promise", async () => {
		const promise1 = Promise.reject("error1");
		const promise2 = Promise.resolve("success2");
		const promise3 = Promise.resolve("success3");

		const result = await promiseAny([promise1, promise2, promise3]);
		expect(result).toBe("success2");
	});

	it("rejects with an AggregateError if all promises reject", async () => {
		const promise1 = Promise.reject("error1");
		const promise2 = Promise.reject("error2");
		const promise3 = Promise.reject("error3");

		try {
			await promiseAny([promise1, promise2, promise3]);
		} catch (error) {
			expect((error as any).errors).toEqual(["error1", "error2", "error3"]);
		}
	});

	it("handles promises with different resolve times", async () => {
		const promise1 = new Promise((resolve) =>
			setTimeout(() => resolve("success1"), 100),
		);
		const promise2 = new Promise((resolve) =>
			setTimeout(() => resolve("success2"), 50),
		);
		const promise3 = Promise.resolve("success3");

		const result = await promiseAny([promise1, promise2, promise3]);
		expect(result).toBe("success3");
	});

	it("handles promises with some rejects and different resolve times", async () => {
		const promise1 = new Promise((resolve, reject) =>
			setTimeout(() => reject("error1"), 100),
		);
		const promise2 = new Promise((resolve) =>
			setTimeout(() => resolve("success2"), 50),
		);
		const promise3 = Promise.resolve("success3");

		const result = await promiseAny([promise1, promise2, promise3]);
		expect(result).toBe("success3");
	});
});
