export const objectAssign = (target: any, ...sources: any[]): any => {
	if (target === null || target === undefined) {
		throw new Error("target cannot be null or undefined");
	}

	const targetObject = new Object(target);

	for (let i = 0; i < sources.length; i++) {
		const source = sources[i];

		if (source === null || source === undefined) {
			throw new Error(`soruce can't be null or undefined`);
		}

		const sourceObject = new Object(source);

		const keys = Reflect.ownKeys(sourceObject);

		for (const key of keys) {
			const targetKeyDescriptor = Object.getOwnPropertyDescriptor(
				targetObject,
				key,
			);

			const sourceDescriptor = Object.getOwnPropertyDescriptor(
				sourceObject,
				key,
			);

			// checking if the target has the key and if it is writable or not
			if (targetKeyDescriptor?.writable === false) {
				throw new Error(`${String(key)} in target is not writable`);
			}

			// checking if the source property key is enumerable to copy
			if (sourceDescriptor?.enumerable === true) {
				target[key] = source[key];
			}
		}
	}

	return targetObject;
};
