import { describe, it, expect } from "vitest";
import { MyPromise, PromiseState } from "../tasks/custom_promise";

// const MyPromise = Promise

const DEFAULT_VALUE = "default";

function promise<T>({
	value,
	fail = false,
}: { value?: T; fail?: boolean } = {}): MyPromise<T> {
	return new MyPromise<T>((resolve, reject) => {
		fail ? reject(value as T) : resolve(value as T);
	});
}

describe("then", () => {
	it("with no chaining", () => {
		return promise<string>({ value: DEFAULT_VALUE }).then((v: string) =>
			expect(v).toEqual(DEFAULT_VALUE),
		);
	});

	it("with multiple thens for same promise", () => {
		const checkFunc = (v: string) => expect(v).toEqual(DEFAULT_VALUE);
		const mainPromise = promise<string>();
		const promise1 = mainPromise.then(checkFunc);
		const promise2 = mainPromise.then(checkFunc);
		return Promise.allSettled([promise1, promise2]);
	});

	it("with then and catch", () => {
		const checkFunc = (v: string) => expect(v).toEqual(DEFAULT_VALUE);
		const failFunc = (v: any) => expect(1).toEqual(2);
		const resolvePromise = promise<string>().then(checkFunc, failFunc);
		const rejectPromise = promise<string>({ fail: true }).then(
			failFunc,
			checkFunc,
		);
		return Promise.allSettled([resolvePromise, rejectPromise]);
	});

	it("with chaining", () => {
		return (promise<number>({ value: 3 }) as any)
			.then((v: number): MyPromise<number> => MyPromise.resolve(v * 4))
			.then((v: number) => expect(v).toEqual(12));
	});
});

describe("catch", () => {
	it("with no chaining", () => {
		return promise<string>({ value: DEFAULT_VALUE, fail: true }).catch(
			(v: string) => expect(v).toEqual(DEFAULT_VALUE),
		);
	});

	it("with multiple catches for same promise", () => {
		const checkFunc = (v: string) => expect(v).toEqual(DEFAULT_VALUE);
		const mainPromise = promise<string>({ fail: true });
		const promise1 = mainPromise.catch(checkFunc);
		const promise2 = mainPromise.catch(checkFunc);
		return Promise.allSettled([promise1, promise2]);
	});

	it("with chaining", () => {
		return promise<number>({ value: 3 })
			.then((v) => {
				throw v * 4;
			})
			.catch((v: number) => expect(v).toEqual(12));
	});
});

describe("finally", () => {
	it("with no chaining", () => {
		const checkFunc = () => expect(undefined).toBeUndefined();
		const successPromise = promise().finally(checkFunc);
		const failPromise = promise({ fail: true }).finally(checkFunc);
		return Promise.allSettled([successPromise, failPromise]);
	});

	it("with multiple finallys for same promise", () => {
		const checkFunc = () => expect(undefined).toBeUndefined();
		const mainPromise = promise();
		const promise1 = mainPromise.finally(checkFunc);
		const promise2 = mainPromise.finally(checkFunc);
		return Promise.allSettled([promise1, promise2]);
	});

	it("with chaining", () => {
		const checkFunc = () => expect(undefined).toBeUndefined();
		const successPromise = promise()
			.then((v: any) => v)
			.finally(checkFunc);
		const failPromise = promise({ fail: true })
			.then((v: any) => v)
			.finally(checkFunc);
		return Promise.allSettled([successPromise, failPromise]);
	});
});

describe("static methods", () => {
	it("resolve", () => {
		return MyPromise.resolve(DEFAULT_VALUE).then((v: string) =>
			expect(v).toEqual(DEFAULT_VALUE),
		);
	});

	it("reject", () => {
		return MyPromise.reject(DEFAULT_VALUE).catch((v: string) =>
			expect(v).toEqual(DEFAULT_VALUE),
		);
	});

	describe("all", () => {
		it("with success", () => {
			return MyPromise.all([promise({ value: 1 }), promise({ value: 2 })]).then(
				(v: number[]) => expect(v).toEqual([1, 2]),
			);
		});

		it("with fail", () => {
			return MyPromise.all([
				promise({ value: DEFAULT_VALUE }) as any,
				promise({ value: DEFAULT_VALUE, fail: true }),
			]).catch((v: string) => expect(v).toEqual(DEFAULT_VALUE));
		});
	});

	it("allSettled", () => {
		return MyPromise.allSettled([
			promise({ value: DEFAULT_VALUE }),
			promise({ value: DEFAULT_VALUE, fail: true }),
		]).then((v: PromiseSettledResult<any>[]) =>
			expect(v).toEqual([
				{ status: "fulfilled", value: DEFAULT_VALUE },
				{ status: "rejected", reason: DEFAULT_VALUE },
			]),
		);
	});

	describe("race", () => {
		it("with success", () => {
			return MyPromise.race([
				promise({ value: 1 }),
				promise({ value: 2 }),
			]).then((v: number) => expect(v).toEqual(1));
		});

		it("with fail", () => {
			return MyPromise.race([
				promise({ fail: true, value: 1 }),
				promise({ fail: true, value: 2 }),
			]).catch((v: number) => expect(v).toEqual(1));
		});
	});

	describe("any", () => {
		it("with success", () => {
			return MyPromise.any([promise({ value: 1 }), promise({ value: 2 })]).then(
				(v: number) => expect(v).toEqual(1),
			);
		});

		it("with fail", () => {
			return MyPromise.any([
				promise({ fail: true, value: 1 }),
				promise({ value: 2 }),
			]).catch((e: any) => expect(e.errors).toEqual([1, 2]));
		});
	});
});
