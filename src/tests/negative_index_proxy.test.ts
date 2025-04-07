import { expect, test } from "vitest";
import { wrap } from "../tasks/negative_index_proxy";

test("accessing elements with positive indices", () => {
	const arr = [1, 2, 3];
	const wrappedArr = wrap(arr);

	expect(wrappedArr[0]).toBe(1);
	expect(wrappedArr[1]).toBe(2);
	expect(wrappedArr[2]).toBe(3);
});

test("accessing elements with negative indices", () => {
	const arr = [1, 2, 3];
	const wrappedArr = wrap(arr);

	expect(wrappedArr[-1]).toBe(3);
	expect(wrappedArr[-2]).toBe(2);
	expect(wrappedArr[-3]).toBe(1);
});

test("setting elements with positive indices", () => {
	const arr = [1, 2, 3];
	const wrappedArr = wrap(arr);

	wrappedArr[0] = 4;
	expect(wrappedArr[0]).toBe(4);
	expect(arr[0]).toBe(4);
});

test("setting elements with negative indices", () => {
	const arr = [1, 2, 3];
	const wrappedArr = wrap(arr);

	wrappedArr[-1] = 4;
	expect(wrappedArr[-1]).toBe(4);
	expect(arr[2]).toBe(4);
});

test("accessing an element with a negative index that is out of bounds", () => {
	const arr = [1, 2, 3];
	const wrappedArr = wrap(arr);

	expect(() => wrappedArr[-4]).toThrowError("Index out of bounds exception");
});
