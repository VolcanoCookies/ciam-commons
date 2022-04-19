import { flag } from './checks';
import { unique } from './Utils';

export class PermissionError extends Error {
	missing: Array<Flag> | Array<String>;
	constructor(missing: Array<string> | Array<Flag> | undefined) {
		super(`Missing permissions: ${(missing || []).join(', ')}`);
		this.name = 'PermissionError';
		this.missing = missing || [];
	}
}

/**
 * Check if a string is a valid permission flag.
 * 
 * @param perm a string to check.
 * @returns true if {@link perm} is a valid permission flag.
 */
export function validFlag(perm: string): boolean {
	if (perm.length == 0) return false;
	try {
		flag(perm);
		return true;
	} catch (err) {
		return false;
	}
}

// Our lord an savior Ash has come to bless us
export class Flag extends String {
	isWildcard: boolean;
	keys: Array<string>;

	constructor(value: string) {
		flag(value);
		super(value);

		this.isWildcard = value == '*' || value.endsWith('.*');
		this.keys = value.split('.');
	}

	public static validate(value: string | Flag): Flag {
		if (!(value instanceof Flag)) {
			return new Flag(value);
		}
		return value;
	}

	equals(other: Flag): boolean {
		return this.toString() == other.toString();
	}
}

export function flagArray(perms: Array<string | Flag>, ignoreInvalid: boolean = false, removeDuplicate: boolean = true): Array<Flag> {
	const valid = new Array<Flag>();
	for (const p of perms) {
		if (ignoreInvalid) {
			try {
				valid.push(Flag.validate(p));
			} catch (e) { }
		} else {
			valid.push(Flag.validate(p));
		}
	}
	return removeDuplicate ? unique(valid) : valid;
}