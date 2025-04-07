import { describe, it, expect } from "vitest";
import { curryPlaceholderFn } from "../tasks/currying_placeholders";

const _ = "_"; // Placeholder constant

// Helper type for placeholder curried functions in tests
type PlaceholderCurriedFn<T extends (...args: any[]) => any> = (
	...args: any[]
) => ReturnType<T> | PlaceholderCurriedFn<T>;
describe("curryPlaceholderFn", () => {
	const sum = (a: number, b: number, c: number) => a + b + c;
	const curriedSum = curryPlaceholderFn(sum);

	it("should work like basic currying when no placeholders are used", () => {
		expect(curriedSum(1, 2, 3)).toBe(6);
		const add1 = curriedSum(1) as PlaceholderCurriedFn<typeof sum>;
		const add1and2 = add1(2) as PlaceholderCurriedFn<typeof sum>;
		expect(add1and2(3)).toBe(6);
	});

	it("should handle placeholders correctly", () => {
		const add1_3 = curriedSum(1, _, 3) as PlaceholderCurriedFn<typeof sum>;
		expect(add1_3(2)).toBe(6); // Fill the placeholder

		const add_2_3 = curriedSum(_, 2, 3) as PlaceholderCurriedFn<typeof sum>;
		expect(add_2_3(1)).toBe(6);

		const add1_2_ = curriedSum(1, 2, _) as PlaceholderCurriedFn<typeof sum>;
		expect(add1_2_(3)).toBe(6);
	});

	it("should handle multiple placeholders", () => {
		const add_2_ = curriedSum(_, 2, _) as PlaceholderCurriedFn<typeof sum>;
		const add1_2_ = add_2_(1) as PlaceholderCurriedFn<typeof sum>; // Fill first placeholder
		expect(add1_2_(3)).toBe(6); // Fill second placeholder

		const add__3 = curriedSum(_, _, 3) as PlaceholderCurriedFn<typeof sum>;
		const add1__3 = add__3(1) as PlaceholderCurriedFn<typeof sum>;
		expect(add1__3(2)).toBe(6);
	});

	it("should handle placeholders with incremental arguments", () => {
		const add1__ = curriedSum(1, _, _) as PlaceholderCurriedFn<typeof sum>;
		const add1_2_ = add1__(2) as PlaceholderCurriedFn<typeof sum>;
		expect(add1_2_(3)).toBe(6);

		const add_2_ = curriedSum(_, 2, _) as PlaceholderCurriedFn<typeof sum>;
		const add_2_3 = add_2_(3) as PlaceholderCurriedFn<typeof sum>; // Fills the second placeholder first
		expect(add_2_3(1)).toBe(6); // Fills the first placeholder
	});

	it("should ignore extra arguments once the function is fully applied", () => {
		expect(curriedSum(1, 2, 3, 4, 5)).toBe(6); // Extra args ignored

		const add1_3 = curriedSum(1, _, 3) as PlaceholderCurriedFn<typeof sum>;
		expect(add1_3(2, 4, 5)).toBe(6); // Extra args ignored
	});

	it("should return a function if not enough non-placeholder arguments are provided", () => {
		expect(typeof curriedSum(1, _)).toBe("function");
		const add1__ = curriedSum(1, _, _) as PlaceholderCurriedFn<typeof sum>;
		expect(typeof add1__(2)).toBe("function");
	});

	it("should handle functions with zero arguments", () => {
		const greet = () => "hello";
		const curriedGreet = curryPlaceholderFn(greet);
		expect(curriedGreet()).toBe("hello");
	});

	it("should handle functions with one argument", () => {
		const identity = (a: number) => a;
		const curriedIdentity = curryPlaceholderFn(identity);
		expect(curriedIdentity(5)).toBe(5);
		// Using placeholder doesn't make sense here but shouldn't break
		const id_ = curriedIdentity(_) as PlaceholderCurriedFn<typeof identity>;
		expect(id_(10)).toBe(10);
	});

	// Similar note about `this` context as in basic currying
	it("should work with functions that don't rely on 'this'", () => {
		const concat = (a: string, b: string, c: string) => a + b + c;
		const curriedConcat = curryPlaceholderFn(concat);
		const concatHello = curriedConcat("hello", _, _) as PlaceholderCurriedFn<
			typeof concat
		>;
		const concatHelloWorld = concatHello(" world") as PlaceholderCurriedFn<
			typeof concat
		>;
		expect(concatHelloWorld("!")).toBe("hello world!");

		const concat_World_ = curriedConcat(_, " world", _) as PlaceholderCurriedFn<
			typeof concat
		>;
		const concatHello_World_ = concat_World_("hello") as PlaceholderCurriedFn<
			typeof concat
		>;
		expect(concatHello_World_("!")).toBe("hello world!");
	});
});
