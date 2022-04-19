export declare class PermissionError extends Error {
    missing: Array<Flag> | Array<String>;
    constructor(missing: Array<string> | Array<Flag> | undefined);
}
/**
 * Check if a string is a valid permission flag.
 *
 * @param perm a string to check.
 * @returns true if {@link perm} is a valid permission flag.
 */
export declare function validFlag(perm: string): boolean;
export declare class Flag extends String {
    isWildcard: boolean;
    keys: Array<string>;
    constructor(value: string);
    static validate(value: string | Flag): Flag;
    equals(other: Flag): boolean;
}
export declare function flagArray(perms: Array<string | Flag>, ignoreInvalid?: boolean, removeDuplicate?: boolean): Array<Flag>;
