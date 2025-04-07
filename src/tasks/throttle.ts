export const throttleFn = <T extends (...args: any[]) => void>(
	fn: T,
	ms: number,
): T => {
	let timeout: NodeJS.Timeout | number | null = null;

	const throttledFn = (...args: Parameters<T>) => {
		if (timeout === null) {
			fn(...args);
			timeout = setTimeout(() => {
				timeout = null;
			}, ms);
		}
	};

	return throttledFn as T;
};
