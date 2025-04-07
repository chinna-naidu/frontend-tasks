import { pipe } from "../tasks/pipe";

describe("pipe", () => {
	it("should pipe functions correctly", async () => {
		const add1 = (x: number) => x + 1;
		const multiplyBy2 = (x: number) => x * 2;
		const piped = pipe(add1, multiplyBy2);
		const result = await piped(1);
		expect(result).toBe(4);
	});

	it("should handle async functions", async () => {
		const add1Async = async (x: number) => x + 1;
		const multiplyBy2Async = async (x: number) => x * 2;
		const piped = pipe(add1Async, multiplyBy2Async);
		const result = await piped(1);
		expect(result).toBe(4);
	});

	it("should handle mixed sync and async functions", async () => {
		const add1 = (x: number) => x + 1;
		const multiplyBy2Async = async (x: number) => x * 2;
		const piped = pipe(add1, multiplyBy2Async);
		const result = await piped(1);
		expect(result).toBe(4);
	});

	it("should handle multiple functions", async () => {
		const add1 = (x: number) => x + 1;
		const multiplyBy2 = (x: number) => x * 2;
		const subtract3 = (x: number) => x - 3;
		const piped = pipe(add1, multiplyBy2, subtract3);
		const result = await piped(1);
		expect(result).toBe(1);
	});

	it("should handle functions with different argument types", async () => {
		const convertToString = (x: number) => x.toString();
		const addPrefix = (x: string) => `prefix_${x}`;
		const piped = pipe(convertToString, addPrefix);
		const result = await piped(1);
		expect(result).toBe("prefix_1");
	});
});
