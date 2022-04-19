import { flag } from './checks';
import { unique } from './Utils';
export class PermissionError extends Error {
    missing;
    constructor(missing) {
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
export function validFlag(perm) {
    if (perm.length == 0)
        return false;
    try {
        flag(perm);
        return true;
    }
    catch (err) {
        return false;
    }
}
// Our lord an savior Ash has come to bless us
export class Flag extends String {
    isWildcard;
    keys;
    constructor(value) {
        flag(value);
        super(value);
        this.isWildcard = value == '*' || value.endsWith('.*');
        this.keys = value.split('.');
    }
    static validate(value) {
        if (!(value instanceof Flag)) {
            return new Flag(value);
        }
        return value;
    }
    equals(other) {
        return this.toString() == other.toString();
    }
}
export function flagArray(perms, ignoreInvalid = false, removeDuplicate = true) {
    const valid = new Array();
    for (const p of perms) {
        if (ignoreInvalid) {
            try {
                valid.push(Flag.validate(p));
            }
            catch (e) { }
        }
        else {
            valid.push(Flag.validate(p));
        }
    }
    return removeDuplicate ? unique(valid) : valid;
}
