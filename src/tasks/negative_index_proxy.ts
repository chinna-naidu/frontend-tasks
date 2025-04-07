export const wrap = <T>(arr: T[]) => {
	const proxy = new Proxy(arr, {
		set(target, prop, value) {
			const index = Number(prop);

			if (index < 0) {
				const posIdx = target.length + index;

				if (posIdx < 0) {
					throw new Error("Index out of bounds exception");
				}

				target[posIdx] = value;

				return true;
			}

			target[index] = value;

			return true;
		},

		get(target, prop, value) {
			const index = Number(prop);

			if (index < 0) {
				const posIdx = target.length + index;

				if (posIdx < 0) {
					throw new Error("Index out of bounds exception");
				}

				return target[posIdx];
			}

			return target[index];
		},
	});

	return proxy;
};
