import { expect, test } from "vitest";
import { stringifyObject } from "../tasks/stringify_object";

describe("stringifyObject", () => {
	test("should return 'null' for null", () => {
		expect(stringifyObject(null)).toBe("null");
	});

	test("should return undefined for function", () => {
		expect(stringifyObject(() => {})).toBeUndefined();
	});

	test("should return undefined for undefined", () => {
		expect(stringifyObject(undefined)).toBeUndefined();
	});

	test("should return undefined for symbol", () => {
		expect(stringifyObject(Symbol())).toBeUndefined();
	});

	test("should return string with quotes for string", () => {
		expect(stringifyObject("hello")).toBe('"hello"');
	});

	test("should return string for number", () => {
		expect(stringifyObject(123)).toBe("123");
	});

	test("should return string with quotes for Date", () => {
		const date = new Date(2023, 11, 31, 18, 30, 0);
		expect(stringifyObject(date)).toBe(`"${date.toISOString()}"`);
	});

	test("should return string for BigInt", () => {
		expect(stringifyObject(BigInt(123))).toBe("123");
	});

	test("should return string for array", () => {
		expect(stringifyObject([1, "hello", null, undefined, BigInt(123)])).toBe(
			'[ 1, "hello", null, null, 123 ]',
		);
	});

	test("should return string for object", () => {
		expect(
			stringifyObject({
				a: 1,
				b: "hello",
				c: null,
				d: undefined,
				e: BigInt(123),
			}),
		).toBe('{ "a":1, "b":"hello", "e":123 }');
	});
});
