/**
 * A pipe function that handles both async and synchronous functions
 * @param fnList - List of functions to pipe together
 * @returns A function that applies the piped functions to an initial argument
 */
export function pipe<Input, Output>(
	...fnList: [
		(input: Input) => any,
		...Array<(input: any) => any>,
		(input: any) => Output | Promise<Output>,
	]
) {
	return async (initialArg: Input): Promise<Output> => {
		return fnList.reduce(
			async (promiseChain, fn) => {
				const result = await promiseChain;
				return fn(result);
			},
			Promise.resolve(initialArg) as Promise<any>,
		);
	};
}
