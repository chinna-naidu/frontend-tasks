import { describe, it, expect, vi } from "vitest";
import { flattenArray } from "../tasks/deep_flatten_array";

describe("flattenArray", () => {
	test("it should return array as same if depth is given as 0", () => {
		const arr = [[1, 0], 1, 2, 4];

		const result = flattenArray(arr, 0);

		expect(result).toStrictEqual(arr);
	});

	test("it should return array flattened to 1 level if depth is 1", () => {
		const arr = [[1, 0, [0, 1]], 1, 2, 4];

		const result = flattenArray(arr, 1);

		const expected = [1, 0, [0, 1], 1, 2, 4];

		expect(result).toStrictEqual(expected);
	});

	test("it should return array flattened completley  if depth is Infinity", () => {
		const arr = [[1, 0, [0, 1, [0, 1, [0, 1]]]], 1, 2, 4];

		const result = flattenArray(arr, Number.POSITIVE_INFINITY);

		const expected = [1, 0, 0, 1, 0, 1, 0, 1, 1, 2, 4];

		expect(result).toStrictEqual(expected);
	});
});
