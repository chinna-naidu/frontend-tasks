export const flattenArray = <T>(arr: T[], depth: number): T[] => {
	if (depth < 0) throw new Error(`depth can't be negative`);
	if (depth === 0) {
		return arr;
	}

	const result = [];

	for (const item of arr) {
		if (Array.isArray(item)) {
			const flattenedArray = flattenArray(item, depth - 1);
			result.push(...flattenedArray);
		} else {
			result.push(item);
		}
	}

	return result;
};
