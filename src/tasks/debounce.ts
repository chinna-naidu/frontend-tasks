export const debounceFn = <T extends (...args: any[]) => void>(
	fn: T,
	ms: number,
): T => {
	let timeout: NodeJS.Timeout | null = null;

	const debouncedFn = (...args: Parameters<T>) => {
		if (timeout) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(() => {
			fn(...args);
		}, ms);
	};

	return debouncedFn as T;
};
