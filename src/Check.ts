export const objectIdRegex: RegExp = /[a-f0-9]{24}/;
export const discordIdRegex: RegExp = /\d{16,20}/;
export const flagRegex: RegExp = /^(?:([a-z0-9]+|\?)(?:\.(?:[a-z0-9]+|\?))*(\.\*)?|\*)$/;
export const strictFlagRegex: RegExp = /^[a-z0-9]+(\.[a-z0-9]+)*$/;

export class CheckError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'CheckError';
	}
}

export function objectId(id: string, message: string = 'Invalid objectId') {
	if (!id.match(objectIdRegex)) throw new CheckError(`${message} "${id}"`);
}

export function discordId(id: string, message: string = 'Invalid discordId') {
	if (!id.match(discordIdRegex)) throw new CheckError(`${message} "${id}"`);
}

export function flag(flag: string, message: string = 'Invalid permission flag') {
	if (!flag.match(flagRegex)) throw new CheckError(`${message} "${flag}"`);
}

export function strictFlag(flag: string, message: string = 'Invalid strict permission flag') {
	if (!flag.match(strictFlagRegex)) throw new CheckError(`${message} "${flag}"`);
}

export function notEmpty(obj: string | Array<any>, name: string) {
	if (obj.length == 0) throw new CheckError(`${name} cannot be empty`);
}

export function min(n: number, min: number, name: string) {
	if (n < min) throw new CheckError(`${name} cannot be less than ${min}`);
}

export function max(n: number, max: number, name: string) {
	if (n > max) throw new CheckError(`${name} cannot be greater than ${max}`);
}

export function inRange(n: number, minVal: number, maxVal: number, name: string) {
	min(n, minVal, name);
	max(n, maxVal, name);
}

export function oneOf<T>(obj: T, options: Array<T>, name: string) {
	if (!options.includes(obj)) throw new CheckError(`${name} must be one of ${options.toString()}`);
}