import { vi, describe, test } from "vitest";
import { fetchWithRetry } from "../tasks/fetch_with_retry";

describe("fetchWithRetry", () => {
	it("should resolve with data on successful fetch", async () => {
		const mockFetch = vi.fn(() => Promise.resolve("data"));
		const result = await fetchWithRetry(mockFetch, 3);
		expect(result).toBe("data");
		expect(mockFetch).toHaveBeenCalledTimes(1);
	});

	it("should reject with error after retry limit is reached", async () => {
		const mockFetch = vi.fn(() => Promise.reject("error"));
		try {
			await fetchWithRetry(mockFetch, 3);
		} catch (error) {
			expect(error).toBe("error");
			expect(mockFetch).toHaveBeenCalledTimes(3);
		}
	});

	it("should resolve with data after retrying and then succeeding", async () => {
		let attempt = 0;
		const mockFetch = vi.fn(() => {
			attempt++;
			if (attempt === 2) {
				return Promise.resolve("data");
			}
			return Promise.reject("error");
		});
		const result = await fetchWithRetry(mockFetch, 3);
		expect(result).toBe("data");
		expect(mockFetch).toHaveBeenCalledTimes(2);
	});
});
