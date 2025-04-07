export const fetchWithRetry = <T extends () => Promise<any>>(
	fetchFn: T,
	limit: number,
): Promise<ReturnType<T>> => {
	return new Promise((resolve, reject) => {
		let retryLimit = limit;
		const callFn = () => {
			fetchFn()
				.then((data) => resolve(data))
				.catch((err) => {
					retryLimit--;
					if (retryLimit > 0) {
						callFn();
					} else {
						reject(err);
					}
				});
		};

		// calling for the first time
		callFn();
	});
};
