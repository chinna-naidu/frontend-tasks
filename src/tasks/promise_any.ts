import { AggError } from "../utils/aggregate_error";

export const promiseAny = <T>(promiseList: Promise<T>[]): Promise<T> => {
	const errors: Error[] = [];

	return new Promise((resolve, reject) => {
		if (promiseList.length === 0) {
			return reject(new AggError(errors, "Empty Array"));
		}
		for (const promise of promiseList) {
			promise
				.then((data) => {
					return resolve(data);
				})
				.catch((err) => {
					errors.push(err);
					if (errors.length >= promiseList.length) {
						const aggErr = new AggError(errors);
						reject(aggErr);
					}
				});
		}
	});
};
