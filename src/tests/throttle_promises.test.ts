import { describe, expect, it, vi } from "vitest";
import { throttlePromises } from "../tasks/throttle_promises";

const waitFor = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

describe("throttlePromises", () => {
	it("should throttle the execution of promises based on max variable", async () => {
		let oneCalled = false;
		let twoCalled = false;
		let threeCalled = false;
		const promiseFnList = [
			async () => {
				await waitFor(50);
				oneCalled = true;
			},
			async () => {
				await waitFor(100);
				twoCalled = true;
			},
			async () => {
				await waitFor(20);
				threeCalled = true;
			},
		];
		const max = 2;
		const promiseHandle = throttlePromises(promiseFnList, max);

		// as time is not passed all should be false
		expect(oneCalled).toBe(false);
		expect(twoCalled).toBe(false);
		expect(threeCalled).toBe(false);

		// advance timer by 50ms then oneCalled will be true
		// threeCalled will be false because it is not run yet due to max limit of 2
		await vi.advanceTimersByTimeAsync(50);

		expect(oneCalled).toBe(true);
		expect(threeCalled).toBe(false);

		// advance 50ms now total time passed 100ms so twoCalled should be true
		// threeCalled will be false because it is not run yet due to max limit of 2
		await vi.advanceTimersByTimeAsync(50);
		expect(twoCalled).toBe(true);
		expect(threeCalled).toBe(false);

		// now as two are run third one will be picked an will be true after 20ms
		await vi.advanceTimersByTimeAsync(20);
		expect(threeCalled).toBe(true);

		await promiseHandle;
	});

	it("should throw an error if one of the promise fails", async () => {
		const promiseFnList = [
			async () => {},
			async () => {
				throw new Error("custom error");
			},
		];
		const max = 2;
		const promiseHandle = throttlePromises(promiseFnList, max);

		await expect(promiseHandle).rejects.toThrow("custom error");
	});

	it("should return us [] if the array of functions sent to is empty", async () => {
		const result = await throttlePromises([], 2);

		expect(result).toStrictEqual([]);
	});
});
