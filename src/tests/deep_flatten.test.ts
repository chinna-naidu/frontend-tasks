import { expect, test } from "vitest";
import { flatten } from "../tasks/deep_flatten";

describe("flatten", () => {
	test("flatten object", () => {
		const obj = {
			a: 1,
			b: { c: 2, d: { e: 3 } },
			f: [4, [5, 6]],
		};
		const flattened = flatten(obj);
		expect(flattened).toEqual({ a: 1, c: 2, e: 3, f: [4, 5, 6] });
	});

	test("flatten object with array", () => {
		const obj = {
			a: 1,
			b: { c: 2, d: { e: 3 } },
			f: [4, [5, 6]],
			g: { h: [7, [8, 9]] },
		};
		const flattened = flatten(obj);
		expect(flattened).toEqual({
			a: 1,
			c: 2,
			e: 3,
			f: [4, 5, 6],
			h: [7, 8, 9],
		});
	});

	test("flatten object with null value", () => {
		const obj = {
			a: 1,
			b: { c: 2, d: { e: null } },
		};
		const flattened = flatten(obj);
		expect(flattened).toEqual({ a: 1, c: 2, e: null });
	});

	test("flatten empty object", () => {
		const obj = {};
		const flattened = flatten(obj);
		expect(flattened).toEqual({});
	});

	test("flatten object with nested arrays and objects", () => {
		const obj = {
			a: 1,
			b: { c: 2, d: { e: 3, f: [7, 8] } },
			g: [4, [5, { h: 6 }]],
		};
		const flattened = flatten(obj);
		expect(flattened).toEqual({
			a: 1,
			c: 2,
			e: 3,
			f: [7, 8],
			g: [4, 5, { h: 6 }],
		});
	});

	test("flatten array of objects", () => {
		const arr = [{ a: 1 }, { b: 2, c: 3 }];
		const flattened = flatten(arr);
		expect(flattened).toEqual([{ a: 1 }, { b: 2, c: 3 }]);
	});

	test("flatten simple array", () => {
		const arr = [1, 2, 3];
		const flattened = flatten(arr);
		expect(flattened).toEqual([1, 2, 3]);
	});

	test("flatten number", () => {
		const num = 5;
		const flattened = flatten(num);
		expect(flattened).toEqual(5);
	});
});
