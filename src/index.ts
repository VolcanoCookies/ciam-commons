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

export const isPermissionHolder = (
	value: unknown,
): value is PermissionHolder => {
	const holder = value as PermissionHolder;
	if (typeof holder.type !== 'number') return false;
	if (typeof holder.id !== 'string') return false;
	return true;
};

export enum PermissionHolderType {
	USER,
	ROLE,
	DISCORD_USER,
	DISCORD_ROLE,
}

export interface UserPermissionHolder {
	id: string;
	type: PermissionHolderType.USER;
}

export interface DiscordUserPermissionHolder {
	id: string;
	type: PermissionHolderType.DISCORD_USER;
}

export interface RolePermissionHolder {
	id: string;
	type: PermissionHolderType.ROLE;
}

export interface DiscordRolePermissionHolder {
	id: string;
	type: PermissionHolderType.DISCORD_ROLE;
}

export type PermissionHolder =
	| UserPermissionHolder
	| DiscordUserPermissionHolder
	| RolePermissionHolder
	| DiscordRolePermissionHolder;

export const permissionHolderInvocationId = (
	holder: PermissionHolder,
): string => {
	return `${holder.id}-${holder.type}`;
};

// Represents a request to check permissions
export interface CheckRequest {
	// Entity to check permissions on
	holder: PermissionHolder;
	// The required permissions to pass
	required: Flag[];
	/**
	 * Any additional permissions to give the subject while checking.
	 * For example: If we specify ['*'] as additional permissions then all checks will always pass,
	 * even if the subject does not have the required permissions. Because when they are checked,
	 * the '*' flag is temporarily added to the subjects permissions.
	 */
	additional: Flag[];
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
// Thanks for the help??????
export class Flag {
	value: string;
	length: number;
	isWildcard: boolean;
	cooldown: number;
	hasCooldown: boolean;
	limit: number;
	hasLimit: boolean;
	keys: string[];

	constructor(value: string) {
		flag(value);

		this.value = value;
		this.length = value.length;

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
		return this.value === other.value;
	}

	public toString(): string {
		return this.value;
	}

	public toJSON(): string {
		return this.value;
	}
}

export class StrictFlag {
	value: string;
	length: number;

	keys: string[];

	constructor(value: string) {
		strictFlag(value);

		this.value = value;
		this.length = value.length;
		this.keys = value.split('.');
	}

	public static validate(value: string | Flag | StrictFlag): StrictFlag {
		if (value instanceof Flag) return new StrictFlag(value.value);
		else if (value instanceof StrictFlag) return value;
		else return new StrictFlag(value);
	}

	equals(other: Flag | StrictFlag): boolean {
		return this.value === other.value;
	}

	public toString(): string {
		return this.value;
	}

	public toJSON(): string {
		return this.value;
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
