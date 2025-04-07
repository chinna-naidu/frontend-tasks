export const promiseRace = <T>(promiseList: Promise<T>[]): Promise<T> => {
	return new Promise((resolve, reject) => {
		if (promiseList.length === 0) {
			return reject(new Error("Empty promise List"));
		}
		for (const promise of promiseList) {
			promise
				.then((data) => {
					resolve(data);
				})
				.catch((err) => {
					reject(err);
				});
		}
	});
};
