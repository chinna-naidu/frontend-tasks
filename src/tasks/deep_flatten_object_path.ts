export const flattenObjectWithPath = (
	object: Record<string, any>,
	prefix = "",
) => {
	let resultObject: Record<string, any> = {};

	const currentPrefix = prefix.length > 0 ? `${prefix}.` : "";

	for (const key of Object.keys(object)) {
		const keyPrefix = `${currentPrefix}${key}`;

		const value = object[key];
		if (typeof value === "object" && value != null) {
			const flatObject = flattenObjectWithPath(value, keyPrefix);
			resultObject = {
				...resultObject,
				...flatObject,
			};
		} else {
			resultObject[keyPrefix] = value;
		}
	}

	return resultObject;
};
