export const flattenObject = (object: Record<string, any>, depth: number) => {
	if (depth < 0) throw new Error(`depth can't be negative`);

	if (depth === 0) {
		return object;
	}

	let resultObject: Record<string, any> = {};

	for (const key of Object.keys(object)) {
		const value = object[key];
		if (typeof value === "object" && value != null) {
			const flatObject = flattenObject(value, depth - 1);
			resultObject = {
				...resultObject,
				...flatObject,
			};
		} else {
			resultObject[key] = value;
		}
	}

	return resultObject;
};
