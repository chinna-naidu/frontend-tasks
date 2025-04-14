const isNullType = (value: any) => {
	if (typeof value === "object" && value === null) {
		return true;
	}

	if (typeof value === "number" && Number.isNaN(value)) {
		return true;
	}

	if (typeof value === "number" && !Number.isFinite(value)) {
		return true;
	}

	return false;
};

const isIgnorableType = (value: any) => {
	if (typeof value === "function") {
		return true;
	}

	if (typeof value === "undefined" || value === undefined) {
		return true;
	}

	if (typeof value === "symbol") {
		return true;
	}

	return false;
};

export const stringifyObject = (object: any): string | undefined => {
	// handling null types
	if (isNullType(object)) {
		return `${null}`;
	}

	// handling ignorable types
	if (isIgnorableType(object)) {
		return undefined;
	}

	// handling string types
	if (typeof object === "string") {
		return `"${object}"`;
	}

	// handling number types
	if (typeof object === "number") {
		return `${object}`;
	}

	// handling date type objects
	if (typeof object === "object" && object instanceof Date) {
		return `"${object.toISOString()}"`;
	}

	// handling BigInt type objects
	if (typeof object === "bigint") {
		return `${object.toString()}`;
	}

	if (typeof object === "object" && Array.isArray(object)) {
		const stringList: string[] = [];

		for (const item of object) {
			if (isNullType(item) || isIgnorableType(item)) {
				stringList.push(stringifyObject(null) as string);
			} else {
				stringList.push(stringifyObject(item) as string);
			}
		}

		return `[ ${stringList.join(", ")} ]`;
	}

	if (typeof object === "object" && !Array.isArray(object)) {
		const stringList: string[] = [];

		for (const key of Object.keys(object)) {
			const value = object[key];

			if (!isNullType(value) && !isIgnorableType(value)) {
				stringList.push(`"${key}":${stringifyObject(value)}`);
			}
		}

		return `{ ${stringList.join(", ")} }`;
	}
};
