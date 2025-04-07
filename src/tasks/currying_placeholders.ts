const placeholder = "_";

// Define a type for the curried function signature, acknowledging it can return itself or the final result.
// Using 'unknown' as a safer alternative to 'any' for generic currying arguments.
type CurriedResult<T extends (...args: unknown[]) => unknown> =
	| ReturnType<T>
	| ((...args: unknown[]) => CurriedResult<T>);

export function curryPlaceholderFn<T extends (...args: any[]) => any>(
	mainFn: T,
): (...initialArgs: any[]) => CurriedResult<T> {
	// Adjust the main function's return type
	function curried(...args: any[]): CurriedResult<T> {
		// Correct return type for the inner function
		// Use mainFn.length to get the expected number of arguments
		const hasRequiredArgs =
			args.filter((arg) => arg !== placeholder).length >= mainFn.length;

		// Correct placeholder check: true if NO placeholders exist
		const hasNoPlaceholders = !args.some((arg) => arg === placeholder);

		if (hasRequiredArgs && hasNoPlaceholders) {
			// Ensure arguments passed match the expected type T
			return mainFn(...(args as Parameters<T>));
		}

		// return a function to process the next arguments
		// Return a function that accepts the next arguments, using 'unknown'
		return (...nextArgs: unknown[]) => {
			const currentArgs = [...args]; // Clone args to avoid mutation issues
			const filledArgs: unknown[] = []; // Use 'unknown' for the intermediate array
			let nextArgsIndex = 0;

			// Fill placeholders and existing args
			for (const arg of currentArgs) {
				if (arg === placeholder && nextArgsIndex < nextArgs.length) {
					filledArgs.push(nextArgs[nextArgsIndex++]);
				} else {
					filledArgs.push(arg);
				}
			}

			// Add any remaining nextArgs
			const combinedArgs = filledArgs.concat(nextArgs.slice(nextArgsIndex));

			// Recursively call curried with the new set of arguments
			return curried(...combinedArgs);
		};
	}

	// Return the initial curried function
	return curried;
}
