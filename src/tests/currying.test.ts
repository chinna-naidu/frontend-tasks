import { describe, it, expect } from "vitest";
import { curriedFn } from "../tasks/currying";

// Helper type for curried functions in tests
type CurriedFn<T extends (...args: any[]) => any> = (
	...args: any[]
) => ReturnType<T> | CurriedFn<T>;

describe("curriedFn", () => {
	it("should return the result when all arguments are provided at once", () => {
		const sum = (a: number, b: number, c: number) => a + b + c;
		const curriedSum = curriedFn(sum);
		expect(curriedSum(1, 2, 3)).toBe(6);
	});

	it("should return a function when not enough arguments are provided", () => {
		const sum = (a: number, b: number, c: number) => a + b + c;
		const curriedSum = curriedFn(sum);
		expect(typeof curriedSum(1)).toBe("function");
		expect(typeof curriedSum(1, 2)).toBe("function");
	});

	it("should return the result when arguments are provided incrementally", () => {
		const sum = (a: number, b: number, c: number) => a + b + c;
		const curriedSum = curriedFn(sum);
		const add1 = curriedSum(1) as CurriedFn<typeof sum>;
		const add1and2 = add1(2) as CurriedFn<typeof sum>;
		expect(add1and2(3)).toBe(6);
	});

	it("should work correctly when arguments are provided in different steps", () => {
		const multiply = (a: number, b: number, c: number, d: number) =>
			a * b * c * d;
		const curriedMultiply = curriedFn(multiply);
		const multiplyStep1 = curriedMultiply(2) as CurriedFn<typeof multiply>;
		const multiplyStep2 = multiplyStep1(3) as CurriedFn<typeof multiply>;
		const multiplyStep3 = multiplyStep2(4) as CurriedFn<typeof multiply>;
		expect(multiplyStep3(5)).toBe(120);

		const multiplyStep1_2 = curriedMultiply(2, 3) as CurriedFn<typeof multiply>;
		expect(multiplyStep1_2(4, 5)).toBe(120);

		const multiplyStep1_3 = curriedMultiply(2) as CurriedFn<typeof multiply>;
		const multiplyStep2_3 = multiplyStep1_3(3, 4) as CurriedFn<typeof multiply>;
		expect(multiplyStep2_3(5)).toBe(120);

		const multiplyStep1_4 = curriedMultiply(2) as CurriedFn<typeof multiply>;
		const multiplyStep2_4 = multiplyStep1_4(3) as CurriedFn<typeof multiply>;
		expect(multiplyStep2_4(4, 5)).toBe(120);
	});

	it("should handle functions with zero arguments", () => {
		const greet = () => "hello";
		const curriedGreet = curriedFn(greet);
		expect(curriedGreet()).toBe("hello");
	});

	it("should handle functions with one argument", () => {
		const identity = (a: number) => a;
		const curriedIdentity = curriedFn(identity);
		expect(curriedIdentity(5)).toBe(5);
		// Calling with no args should return the function itself
		expect(typeof curriedIdentity()).toBe("function");
	});

	// Note: The basic curriedFn doesn't preserve `this` context by default.
	// If `this` context preservation is needed, the implementation would need adjustment.
	// This test assumes the function doesn't rely on `this`.
	it("should work with functions that don't rely on 'this'", () => {
		const concat = (a: string, b: string) => a + b;
		const curriedConcat = curriedFn(concat);
		const concatStep1 = curriedConcat("hello") as CurriedFn<typeof concat>;
		expect(concatStep1(" world")).toBe("hello world");
	});
});
