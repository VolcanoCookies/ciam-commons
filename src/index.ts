export interface DiscordUser {
	id: string;
	name?: string;
	discriminator?: number;
}

export interface User {
	_id: string;
	name: string;
	discord?: DiscordUser;
	permissions: string[];
	roles: string[];
}

export interface Role {
	_id: string;
	name: string;
	description: string;
	permissions: string[];
}

export interface Permission {
	name: string;
	description: string;
	key: string;
	path: string;
	flag: string;
}

// Represents a request to check permissions
export interface CheckRequest {
	// What the id field refers to
	type: 'user' | 'role' | 'discordUser';
	// The id of the subject we will be checking permissions for
	id: string;
	// The required permissions to pass
	required: Flag[];
	/**
	 * Any additional permissions to give the subject while checking.
	 * For example: If we specify ['*'] as additional permissions then all checks will always pass,
	 * even if the subject does not have the required permissions. Because when they are checked,
	 * the '*' flag is temporarily added to the subjects permissions.
	 */
	additional: Flag[];
	// If the response should include missing permissions, leave as false if you do not intent to use them
	includeMissing: boolean;
	// If we should take cooldowns into consideration
	respectCooldown: boolean;
	// If we should trigger new cooldowns
	invokeCooldown: boolean;
	// If we should take limits into consideration
	respectLimit: boolean;
	// If we should trigger new limits
	invokeLimit: boolean;
}

// Represents the result of checking a single permission
export interface CheckResult {
	// The flag the check was made on.
	flag: Flag;
	// If the subject had all the required permissions, and is not on cooldown.
	passed: boolean;
	// If the user had the correct permission but is on cooldown.
	onCooldown: boolean | undefined;
	// Time in milliseconds since epoch when the cooldown expires.
	cooldownExpires: number | undefined;
}

export class PermissionError extends Error {
	missing: Flag[] | string[];
	constructor(missing: string[] | Flag[] | undefined) {
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
export const validFlag = (perm: string): boolean => {
	if (perm.length === 0) return false;
	try {
		flag(perm);
		return true;
	} catch (err) {
		return false;
	}
};

// Our lord an savior Ash has come to bless us
export class Flag extends String {
	isWildcard: boolean;
	cooldown: number;
	hasCooldown: boolean;
	limit: number;
	hasLimit: boolean;
	keys: string[];

	constructor(value: string) {
		flag(value);
		super(value);

		const parts = value.split(':');

		this.isWildcard = parts[0] === '*' || parts[0].endsWith('.*');
		this.keys = parts[0].split('.');
		if (parts[1]) this.cooldown = parseInt(parts[1], 10);
		else this.cooldown = 0;
		this.hasCooldown = this.cooldown > 0;
		if (parts[2]) this.limit = parseInt(parts[2], 10);
		else this.limit = 0;
		this.hasLimit = this.limit > 0;
	}

	public static validate(value: string | Flag | StrictFlag): Flag {
		if (!(value instanceof Flag)) {
			return new Flag(value as string);
		}
		return value;
	}

	equals(other: Flag | StrictFlag): boolean {
		return this.toString() === other.toString();
	}
}

export class StrictFlag extends String {
	keys: string[];

	constructor(value: string) {
		strictFlag(value);
		super(value);

		this.keys = value.split('.');
	}

	public static validate(value: string | Flag | StrictFlag): StrictFlag {
		if (!(value instanceof StrictFlag)) {
			return new StrictFlag(value as string);
		}
		return value;
	}

	equals(other: StrictFlag | Flag): boolean {
		return this.toString() === other.toString();
	}
}

export const flagArray = (
	perms: (string | Flag)[],
	ignoreInvalid: boolean = false,
	removeDuplicate: boolean = true,
): Flag[] => {
	const valid = new Array<Flag>();
	for (const p of perms) {
		if (ignoreInvalid) {
			try {
				valid.push(Flag.validate(p));
			} catch (e) {
				// Do not throw errors when ignoring invalid flags
			}
		} else {
			valid.push(Flag.validate(p));
		}
	}
	return removeDuplicate ? unique(valid) : valid;
};

export const unique = <T>(arr: T[]): T[] => {
	return arr.filter((v, i, a) => a.indexOf(v) === i);
};

export const difference = <T>(a: T[], b: T[]): T[] => {
	const arr = new Array<T>();
	for (const e of a) {
		if (!b.includes(e)) {
			arr.push(e);
		}
	}
	return arr;
};

export const objectIdRegex = /[a-f0-9]{24}/;
export const discordIdRegex = /\d{16,20}/;
export const flagRegex =
	/^(?:([a-z0-9]+|\?)(?:\.(?:[a-z0-9]+|\?))*(\.\*)?|\*)(?::[0-9]+){0,2}?$/;
export const strictFlagRegex = /^[a-z0-9]+(\.[a-z0-9]+)*$/;

export class CheckError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'CheckError';
	}
}

export const objectId = (id: string, message: string = 'Invalid objectId') => {
	if (!id.match(objectIdRegex)) throw new CheckError(`${message} "${id}"`);
};

export const discordId = (
	id: string,
	message: string = 'Invalid discordId',
) => {
	if (!id.match(discordIdRegex)) throw new CheckError(`${message} "${id}"`);
};

export const flag = (
	flag: string,
	message: string = 'Invalid permission flag',
) => {
	if (!flag.match(flagRegex)) throw new CheckError(`${message} "${flag}"`);
};

export const strictFlag = (
	flag: string,
	message: string = 'Invalid strict permission flag',
) => {
	if (!flag.match(strictFlagRegex))
		throw new CheckError(`${message} "${flag}"`);
};

export const notEmpty = (obj: string | any[], name: string) => {
	if (obj.length === 0) throw new CheckError(`${name} cannot be empty`);
};

export const min = (n: number, min: number, name: string) => {
	if (n < min) throw new CheckError(`${name} cannot be less than ${min}`);
};

export const max = (n: number, max: number, name: string) => {
	if (n > max) throw new CheckError(`${name} cannot be greater than ${max}`);
};

export const inRange = (
	n: number,
	minVal: number,
	maxVal: number,
	name: string,
) => {
	min(n, minVal, name);
	max(n, maxVal, name);
};

export const oneOf = <T>(obj: T, options: T[], name: string) => {
	if (!options.includes(obj))
		throw new CheckError(`${name} must be one of ${options.toString()}`);
};
