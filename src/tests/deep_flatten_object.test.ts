import { describe, it, expect, vi } from "vitest";
import { flattenObject } from "../tasks/deep_flatten_object";

describe("flattenObject", () => {
	test("it should return object as same if depth is given as 0", () => {
		const object = {
			a: {
				b: {
					c: 1,
				},
			},
		};

		const result = flattenObject(object, 0);

		expect(result).toStrictEqual(result);
	});

	test("it should return return object flattned to 1 level if depth is 1", () => {
		const object = {
			a: {
				b: {
					c: 1,
				},
			},
		};

		const result = flattenObject(object, 1);

		const output = {
			b: {
				c: 1,
			},
		};

		expect(result).toStrictEqual(output);
	});

	test("it should return return plain flat object if depth is infinity", () => {
		const object = {
			a: {
				b: {
					c: 1,
				},
			},
		};

		const result = flattenObject(object, Number.POSITIVE_INFINITY);

		const output = {
			c: 1,
		};

		expect(result).toStrictEqual(output);
	});
});
