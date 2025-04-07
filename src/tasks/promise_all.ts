export const promiseAll = <T>(promiseList: Promise<T>[]): Promise<T[]> => {
	let completed = 0;
	const result: T[] = new Array(promiseList.length).fill(null);

	return new Promise((resolve, reject) => {
		if (promiseList.length === 0) {
			resolve([]);
		}
		for (const [idx, promise] of promiseList.entries()) {
			promise
				.then((data) => {
					result[idx] = data;
					completed++;

					if (completed >= promiseList.length) {
						resolve(result);
					}
				})
				.catch((err) => reject(err));
		}
	});
};
