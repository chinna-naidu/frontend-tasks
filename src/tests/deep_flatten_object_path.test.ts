import { describe, it, expect, vi } from "vitest";
import { flattenObjectWithPath } from "../tasks/deep_flatten_object_path";
describe("flattenObjectWithPath", () => {
	test("it should return return plain flat object with key prefixed correctly", () => {
		const object1 = {
			a: {
				b: {
					c: 1,
				},
			},
		};

		const object2 = {
			a: {
				e: {
					h: 1,
				},
			},
			c: {
				d: 1,
			},
			e: {
				f: 1,
			},
		};
		const result1 = flattenObjectWithPath(object1);
		const result2 = flattenObjectWithPath(object2);

		const output1 = {
			"a.b.c": 1,
		};

		const output2 = {
			"a.e.h": 1,
			"c.d": 1,
			"e.f": 1,
		};

		expect(result1).toStrictEqual(output1);
		expect(result2).toStrictEqual(output2);
	});
});
