import { expect, it } from "vitest";
import { objectAssign } from "../tasks/obejct_assign";

it("should assign properties from one object to another", () => {
	const target = {};
	const source = { a: 1, b: "hello" };
	objectAssign(target, source);
	expect(target).toEqual({ a: 1, b: "hello" });
});

it("should assign properties from multiple objects to a target object", () => {
	const target = {};
	const source1 = { a: 1 };
	const source2 = { b: "hello" };
	objectAssign(target, source1, source2);
	expect(target).toEqual({ a: 1, b: "hello" });
});

it("should throw an error if the target is null or undefined", () => {
	expect(() => objectAssign(null, {})).toThrowError(
		"target cannot be null or undefined",
	);
	expect(() => objectAssign(undefined, {})).toThrowError(
		"target cannot be null or undefined",
	);
});

it("should throw an error if a source is null or undefined", () => {
	const target = {};
	expect(() => objectAssign(target, null)).toThrowError(
		"soruce can't be null or undefined",
	);
	expect(() => objectAssign(target, undefined)).toThrowError(
		"soruce can't be null or undefined",
	);
});

it("should throw an error if a property in target is not writable", () => {
	const target = {};
	Object.defineProperty(target, "a", {
		value: 1,
		writable: false,
	});
	const source = { a: 2 };
	expect(() => objectAssign(target, source)).toThrowError(
		"a in target is not writable",
	);
});

it("should not assign non-enumerable properties from source", () => {
	const target = {};
	const source = {};
	Object.defineProperty(source, "a", {
		value: 1,
		enumerable: false,
	});
	objectAssign(target, source);
	expect(target).toEqual({});
});

it("should handle target object with existing properties", () => {
	const target = { c: 3 };
	const source = { a: 1, b: 2 };
	objectAssign(target, source);
	expect(target).toEqual({ c: 3, a: 1, b: 2 });
});

it("should handle source object with no properties", () => {
	const target = { c: 3 };
	const source = {};
	objectAssign(target, source);
	expect(target).toEqual({ c: 3 });
});

it("should return the target object", () => {
	const target = {};
	const source = { a: 1 };
	const result = objectAssign(target, source);
	expect(result).toBe(target);
});
