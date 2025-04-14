import { expect, test } from "vitest";
import { deepEqual } from "../tasks/deep_equal";

test("deepEqual - primitive data types", () => {
	expect(deepEqual(1, 1)).toBe(true);
	expect(deepEqual("hello", "hello")).toBe(true);
	expect(deepEqual(true, true)).toBe(true);
	expect(deepEqual(1, 2)).toBe(false);
	expect(deepEqual("hello", "world")).toBe(false);
	expect(deepEqual(true, false)).toBe(false);
});

test("deepEqual - null and undefined values", () => {
	expect(deepEqual(null, null)).toBe(true);
	expect(deepEqual(undefined, undefined)).toBe(true);
	expect(deepEqual(null, undefined)).toBe(false);
	expect(deepEqual(undefined, null)).toBe(false);
	expect(deepEqual(1, null)).toBe(false);
	expect(deepEqual(null, 1)).toBe(false);
});

test("deepEqual - objects with different keys", () => {
	const obj1 = { a: 1, b: 2 };
	const obj2 = { a: 1, c: 2 };
	expect(deepEqual(obj1, obj2)).toBe(false);
});

test("deepEqual - objects with the same keys and different values", () => {
	const obj1 = { a: 1, b: 2 };
	const obj2 = { a: 1, b: 3 };
	expect(deepEqual(obj1, obj2)).toBe(false);
});

test("deepEqual - objects with the same keys and same values", () => {
	const obj1 = { a: 1, b: 2 };
	const obj2 = { a: 1, b: 2 };
	expect(deepEqual(obj1, obj2)).toBe(true);
});

test("deepEqual - arrays with different lengths", () => {
	const arr1 = [1, 2, 3];
	const arr2 = [1, 2];
	expect(deepEqual(arr1, arr2)).toBe(false);
});

test("deepEqual - arrays with the same lengths and different values", () => {
	const arr1 = [1, 2, 3];
	const arr2 = [1, 2, 4];
	expect(deepEqual(arr1, arr2)).toBe(false);
});

test("deepEqual - arrays with the same lengths and same values", () => {
	const arr1 = [1, 2, 3];
	const arr2 = [1, 2, 3];
	expect(deepEqual(arr1, arr2)).toBe(true);
});

test("deepEqual - nested objects and arrays", () => {
	const obj1 = { a: 1, b: { c: 2, d: [3, 4] } };
	const obj2 = { a: 1, b: { c: 2, d: [3, 4] } };
	expect(deepEqual(obj1, obj2)).toBe(true);

	const obj3 = { a: 1, b: { c: 2, d: [3, 5] } };
	expect(deepEqual(obj1, obj3)).toBe(false);

	const obj4 = { a: 1, b: { c: 2, e: [3, 4] } };
	expect(deepEqual(obj1, obj4)).toBe(false);
});

test("deepEqual - different object types", () => {
	const obj1 = { a: 1 };
	const obj2 = [1];
	expect(deepEqual(obj1, obj2)).toBe(false);
});
