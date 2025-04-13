export const throttlePromises = <T extends () => Promise<any>>(
	promiseFnList: T[],
	max: number,
): Promise<Awaited<ReturnType<T>>[]> => {
	const resultList: Awaited<ReturnType<T>>[] = [];

	return new Promise((resolve, reject) => {
		const runPromisesInRange = (start: number, end: number) => {
			if (promiseFnList.length === 0) return resolve([]);

			if (start >= promiseFnList.length) return;

			const batchFnList = promiseFnList.slice(start, end);

			const promisesBatch = batchFnList.map((fn) => fn());

			Promise.all(promisesBatch)
				.then((batchResultList) => {
					resultList.push(...batchResultList);

					if (resultList.length === promiseFnList.length) {
						resolve(resultList);
					}

					// running the next promises in range
					runPromisesInRange(end, end + max);
				})
				.catch((err) => reject(err));
		};

		// Initial call to start the promise execution
		runPromisesInRange(0, max);
	}) as Promise<Awaited<ReturnType<T>>[]>;
};
