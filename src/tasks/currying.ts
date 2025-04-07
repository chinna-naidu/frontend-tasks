// Define a type that represents a function that can be curried,
// returning either the final result or a function like itself.
type GenericCurriedFn<T extends (...args: any[]) => any> = (
	...args: any[]
) => ReturnType<T> | GenericCurriedFn<T>;

export function curriedFn<T extends (...args: any[]) => any>(
	mainFn: T,
): GenericCurriedFn<T> {
	function curried(...args: any[]): ReturnType<T> | GenericCurriedFn<T> {
		if (args.length >= mainFn.length) {
			return mainFn(...args);
		}
		// The bound function needs to conform to GenericCurriedFn<T>
		const boundFn = curried.bind(null, ...args);
		// We need to cast because .bind returns a generic function type that TS doesn't fully track here
		return boundFn as GenericCurriedFn<T>;
	}

	// Cast the initial return to the defined curried function type
	return curried as GenericCurriedFn<T>;
}
