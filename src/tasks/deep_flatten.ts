const flattenObject = (object: Record<string, any>) => {
	let resultObject: Record<string, any> = {};

	for (const key of Object.keys(object)) {
		const value = object[key];

		if (Array.isArray(value)) {
			resultObject[key] = flattenArray(value);
		} else if (typeof value === "object" && value !== null) {
			const flatObject = flattenObject(value);
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

const flattenArray = <T>(arr: T[]): T[] => {
	const result = [];

	for (const item of arr) {
		if (Array.isArray(item)) {
			const flattened = flattenArray(item);
			result.push(...flattened);
		} else if (typeof item === "object" && item !== null) {
			const flatObject = flattenObject(item);
			result.push(flatObject);
		} else {
			result.push(item);
		}
	}

	return result;
};

/**
 * a function that can flatten types of both array and object
 * @param object
 * @param depth
 * @returns
 */
export const flatten = <T>(object: T) => {
	if (!Array.isArray(object) && typeof object !== "object" && object !== null) {
		return object;
	}

	if (Array.isArray(object)) {
		return flattenArray(object);
	}

	if (typeof object === "object" && object !== null) {
		return flattenObject(object);
	}
};
