export class AggError extends Error {
	errors: any[];

	constructor(errors: any[], message?: string) {
		super(message);
		this.name = "AggregateError";
		this.errors = errors;
	}
}
