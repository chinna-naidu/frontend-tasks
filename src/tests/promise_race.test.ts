import { describe, it, expect } from "vitest";
import { promiseRace } from "../../src/tasks/promise_race";

describe("promiseRace", () => {
	it("resolves with the first resolved promise", async () => {
		const promise1 = new Promise((resolve) =>
			setTimeout(() => resolve("success1"), 50),
		);
		const promise2 = Promise.resolve("success2");
		const promise3 = Promise.resolve("success3");

		const result = await promiseRace([promise1, promise2, promise3]);
		expect(result).toBe("success2");
	});

	it("rejects with the first rejected promise", async () => {
		const promise1 = new Promise((resolve, reject) =>
			setTimeout(() => reject("error1"), 50),
		);
		const promise2 = Promise.reject("error2");
		const promise3 = Promise.reject("error3");

		try {
			await promiseRace([promise1, promise2, promise3]);
		} catch (error) {
			expect(error).toBe("error2");
		}
	});

	it("rejects with an error if the promise list is empty", async () => {
		try {
			await promiseRace([]);
		} catch (error) {
			expect((error as Error).message).toBe("Empty promise List");
		}
	});

	it("handles promises with different resolve/reject times", async () => {
		const promise1 = new Promise((resolve) =>
			setTimeout(() => resolve("success1"), 50),
		);
		const promise2 = new Promise((resolve, reject) =>
			setTimeout(() => reject("error2"), 25),
		);
		const promise3 = Promise.resolve("success3");

		try {
			await promiseRace([promise1, promise2, promise3]);
		} catch (error) {
			expect(error).toBe("error2");
		}
	});
});
