import { AggError } from "../utils/aggregate_error";

/**
 * Enum representing the possible states of a Promise.
 */
export enum PromiseState {
	PENDING = "pending",
	FULFILLED = "fulfilled",
	REJECTED = "rejected",
}

/**
 * Type definition for a function that resolves a Promise.
 */
type ResolveFn<T> = (value: T) => void;

/**
 * Type definition for a function that rejects a Promise.
 */
type RejectFn = (value: any) => void;

/**
 * Type definition for the executor function used to create a Promise.
 */
type ExecutorFn<T> = (resolve: ResolveFn<T>, reject: RejectFn) => void;

/**
 * Interface representing the result of a fulfilled Promise.
 */
interface PromiseFulfilledResult<T> {
	status: "fulfilled";
	value: T;
}

/**
 * Interface representing the result of a rejected Promise.
 */
interface PromiseRejectedResult {
	status: "rejected";
	reason: any;
}

/**
 * Type definition for a Promise that can be either fulfilled or rejected.
 */
type PromiseSettledResult<T> =
	| PromiseFulfilledResult<T>
	| PromiseRejectedResult;

/**
 * Custom implementation of a Promise.
 */
export class MyPromise<T> {
	#state: PromiseState = PromiseState.PENDING;

	#value!: T | MyPromise<T>;

	#thenCbList: ResolveFn<T>[] = [];
	#catchCbList: RejectFn[] = [];

	#resolveBinded = this.#resolve.bind(this);
	#rejectBinded = this.#reject.bind(this);

	/**
	 * Constructs a new MyPromise instance.
	 * @param executorFn - The function that will be executed to resolve or reject the Promise.
	 */
	constructor(executorFn: ExecutorFn<T>) {
		try {
			executorFn(this.#resolveBinded, this.#rejectBinded);
		} catch (error) {
			this.#reject(error);
		}
	}

	/**
	 * Resolves the Promise with the given value.
	 * @param value - The value to resolve the Promise with.
	 * @returns A new MyPromise that resolves with the given value.
	 */
	static resolve<R>(value: R) {
		return new MyPromise<R>((resolve, reject) => {
			resolve(value);
		});
	}

	/**
	 * Rejects the Promise with the given value.
	 * @param value - The value to reject the Promise with.
	 * @returns A new MyPromise that rejects with the given value.
	 */
	static reject<R>(value: R) {
		return new MyPromise<R>((resolve, reject) => {
			reject(value);
		});
	}

	/**
	 * Returns a Promise that resolves when all of the promises in the given array have resolved.
	 * @param promiseList - An array of MyPromise instances.
	 * @returns A new MyPromise that resolves with an array of results.
	 */
	static all<R>(promiseList: MyPromise<R>[]): MyPromise<R[]> {
		const resultList = new Array<R>(promiseList.length);
		let completed = 0;

		return new MyPromise((resolve, reject) => {
			for (const [idx, promise] of promiseList.entries()) {
				if (promiseList.length === 0) {
					resolve([]);
				}
				promise
					.then((result) => {
						resultList[idx] = result;
						completed++;
						if (completed === promiseList.length) {
							resolve(resultList);
						}
					})
					.catch((err) => {
						reject(err);
					});
			}
		});
	}

	/**
	 * Returns a Promise that resolves as soon as one of the promises in the given array resolves.
	 * @param promiseList - An array of MyPromise instances.
	 * @returns A new MyPromise that resolves with the value of the first resolved promise.
	 */
	static any<R>(promiseList: MyPromise<R>[]): MyPromise<R> {
		const errors: Error[] = [];

		return new MyPromise((resolve, reject) => {
			if (promiseList.length === 0) {
				return reject(new AggError(errors, "Empty Array"));
			}
			for (const promise of promiseList) {
				promise
					.then((data) => {
						return resolve(data);
					})
					.catch((err) => {
						errors.push(err);
						if (errors.length >= promiseList.length) {
							const aggErr = new AggError(errors);
							reject(aggErr);
						}
					});
			}
		});
	}

	/**
	 * Returns a Promise that resolves or rejects as soon as one of the promises in the given array resolves or rejects.
	 * @param promiseList - An array of MyPromise instances.
	 * @returns A new MyPromise that resolves or rejects based on the first settled promise.
	 */
	static race<R>(promiseList: MyPromise<R>[]): MyPromise<R> {
		return new MyPromise((resolve, reject) => {
			if (promiseList.length === 0) {
				reject(new Error("empty promise list"));
			}
			for (const promise of promiseList) {
				promise.then((result) => resolve(result)).catch((err) => reject(err));
			}
		});
	}

	/**
	 * Returns a Promise that resolves after all of the given promises have settled, regardless of their outcome.
	 * @param promises - An iterable of MyPromise instances.
	 * @returns A new MyPromise that resolves with an array of results for each promise.
	 */
	static allSettled = <R>(
		promises: Iterable<MyPromise<R>>,
	): MyPromise<PromiseSettledResult<R>[]> => {
		let completed = 0;
		const promiseList = Array.from(promises) as Array<MyPromise<R>>;
		const resultList = new Array<PromiseSettledResult<R>>(promiseList.length);

		return new MyPromise((resolve, reject) => {
			if (promiseList.length === 0) {
				resolve([]);
			}
			for (const [idx, promise] of promiseList.entries()) {
				promise
					.then((data) => {
						resultList[idx] = {
							status: "fulfilled",
							value: data,
						};
					})
					.catch((err) => {
						resultList[idx] = {
							status: "rejected",
							reason: err,
						};
					})
					.finally(() => {
						completed++;

						if (completed >= resultList.length) {
							resolve(resultList);
						}
					});
			}
		});
	};

	/**
	 * Resolves the Promise with the given value.
	 * @param value - The value to resolve the Promise with.
	 */
	#resolve(value: T) {
		this.#updateValue(value, PromiseState.FULFILLED);
	}

	/**
	 * Rejects the Promise with the given reason.
	 * @param reason - The reason for rejecting the Promise.
	 */
	#reject(reason: any) {
		this.#updateValue(reason, PromiseState.REJECTED);
	}

	/**
	 * Updates the value and state of the Promise.
	 * @param value - The value or reason to update the Promise with.
	 * @param state - The new state of the Promise.
	 */
	#updateValue(value: T | any, state: PromiseState) {
		// to make promise update async
		queueMicrotask(() => {
			// only update the value if state is not pending
			// because we are binding #resolve and #reject to value if value is promise
			// this is to prevent an infinite loop in the pending case
			if (this.#state !== PromiseState.PENDING) {
				return;
			}

			// if the value to update is an instance of promise
			// then bind that promise to the current insances #resolve and #reject handlers
			// which will make sure the promise will be resolved to a value
			// return to prevent the value updated as a promise and resolved as promise
			if (value instanceof MyPromise) {
				value.then(this.#resolveBinded, this.#rejectBinded);
				return;
			}

			this.#state = state;
			this.#value = value;

			this.#executeHandlers();
		});
	}

	/**
	 * Executes the appropriate handlers based on the current state of the Promise.
	 */
	#executeHandlers() {
		// if promise state is resolved to fulfilled then running all the `then` callbacks
		// and updating them with the resolved value
		// clear the cb list after running to prevent same cbs form running again.
		if (this.#state === PromiseState.FULFILLED) {
			for (const cb of this.#thenCbList) {
				cb(this.#value as T);
			}

			this.#thenCbList = [];
		}

		// if promise state is resolved to rejected then running all the catch callbacks
		// and updating them with the resolved value
		// clear the cb list after running to prevent same cbs form running again.
		if (this.#state === PromiseState.REJECTED) {
			for (const cb of this.#catchCbList) {
				cb(this.#value);
			}

			this.#catchCbList = [];
		}
	}

	/**
	 * Adds fulfillment and rejection handlers to the Promise, and returns a new Promise resolving to the return value of the called handler, or to its original settled value.
	 * @param onSuccess - The function to call if the Promise is fulfilled.
	 * @param onFailure - The function to call if the Promise is rejected.
	 * @returns A new MyPromise that resolves or rejects based on the handlers.
	 */
	// biome-ignore lint/suspicious/noThenProperty: <explanation>
	then(onSuccess: ResolveFn<T> | null, onFailure?: RejectFn | null) {
		return new MyPromise((resolve, reject) => {
			this.#thenCbList.push((result) => {
				// if then is called from catch block skipping to next then block
				if (onSuccess === null || onSuccess === undefined) {
					resolve(result);
					return;
				}

				// if then called normally call the new then with current success function's result
				try {
					resolve(onSuccess(result));
				} catch (error) {
					reject(error);
				}
			});

			this.#catchCbList.push((result) => {
				// if a second argument for then is not provided then reject the result
				// so it will be handled by catch cb function
				if (onFailure === null || onFailure === undefined) {
					reject(result);
					return;
				}

				// if the second argument is provided then run the callback and resolve the result
				try {
					resolve(onFailure(result));
				} catch (error) {
					reject(error);
				}
			});

			// running the callbacks based on the result
			this.#executeHandlers();
		});
	}

	/**
	 * Adds a rejection handler to the Promise, and returns a new Promise resolving to the return value of the callback if it is called, or to its original settled value.
	 * @param onFailure - The function to call if the Promise is rejected.
	 * @returns A new MyPromise that resolves or rejects based on the handler.
	 */
	catch(onFailure: RejectFn) {
		return this.then(null, onFailure);
	}

	/**
	 * Adds a handler to be called when the Promise is settled, regardless of its outcome.
	 * @param cb - The function to call when the Promise is settled.
	 * @returns A new MyPromise that resolves or rejects based on the original Promise.
	 */
	finally(cb: () => void) {
		return this.then(
			(result) => {
				cb();
				return result;
			},
			(err) => {
				cb();
				throw err;
			},
		);
	}
}
