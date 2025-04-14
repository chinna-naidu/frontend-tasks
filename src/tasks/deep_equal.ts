export const deepEqual = (object1: any, object2: any): boolean => {
	// checking for primitive data type case
	if (object1 === object2) {
		return true;
	}

	// checking for null undefined case
	// biome-ignore lint/suspicious/noDoubleEquals: <explanation>
	if (object1 == object2 && (object1 === null || object1 === undefined)) {
		return false;
	}

	// handling object case
	if (
		typeof object1 === typeof object2 &&
		typeof object1 === "object" &&
		!Array.isArray(object1)
	) {
		const keys1 = Object.keys(object1);
		const keys2 = Object.keys(object2);
		// checking if length of keys match for deep equality
		if (keys1.length !== keys2.length) return false;

		// checking if the values of keys are equal for deep equality
		for (const key of keys1) {
			if (!deepEqual(object1[key], object2[key])) return false;
		}
		return true;
	}

	// handling array case
	if (
		typeof object1 === typeof object2 &&
		Array.isArray(object1) &&
		Array.isArray(object2)
	) {
		// checking lengths of both arrays for deep equality
		if (object1.length !== object2.length) return false;

		// checking elements of both arrays for deep equality
		for (let i = 0; i < object1.length; i++) {
			if (!deepEqual(object1[i], object2[i])) return false;
		}
		return true;
	}

	return false;
};
