interface PromiseFulfilledResult<T> {
	status: "fulfilled";
	value: T;
}

interface PromiseRejectedResult {
	status: "rejected";
	reason: any;
}

type PromiseSettledResult<T> =
	| PromiseFulfilledResult<T>
	| PromiseRejectedResult;

export const promiseAllSettled = <T>(
	promiseList: Promise<T>[],
): Promise<PromiseSettledResult<T>[]> => {
	let completed = 0;
	const resultList = new Array<PromiseSettledResult<T>>(promiseList.length);

	return new Promise((resolve, reject) => {
		if (promiseList.length === 0) {
			resolve([]);
		}
		for (const [idx, promise] of promiseList.entries()) {
			promise
				.then((data) => {
					resultList[idx] = {
						status: "fulfilled",
						value: data,
					};
				})
				.catch((err) => {
					resultList[idx] = {
						status: "rejected",
						reason: err,
					};
				})
				.finally(() => {
					completed++;

					if (completed >= resultList.length) {
						resolve(resultList);
					}
				});
		}
	});
};
