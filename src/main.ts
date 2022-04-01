export namespace Check {

    export const objectIdRegex: RegExp = /[a-f0-9]{24}/;
    export const discordIdRegex: RegExp = /\d{16,20}/;
    export const flagRegex: RegExp = /^(?:([a-z0-9]+|\?)(?:\.(?:[a-z0-9]+|\?))*(\.\*)?|\*)$/;
    export const strictFlagRegex: RegExp = /^[a-z0-9]+(\.[a-z0-9]+)*$/;

    export function objectId(id: string, message: string = 'Invalid objectId') {
        if (!id.match(objectIdRegex)) throw new Error(`${message} "${id}"`);
    }

    export function discordId(id: string, message: string = 'Invalid discordId') {
        if (!id.match(discordIdRegex)) throw new Error(`${message} "${id}"`);
    }

    export function flag(flag: string, message: string = 'Invalid permission flag') {
        if (!flag.match(flagRegex)) throw new Error(`${message} "${flag}"`);
    }

    export function strictFlag(flag: string, message: string = 'Invalid strict permission flag') {
        if (!flag.match(strictFlagRegex)) throw new Error(`${message} "${flag}"`);
    }

    export function notEmpty(obj: string | Array<any>, name: string) {
        if (obj.length == 0) throw new Error(`${name} cannot be empty`);
    }

    export function min(n: number, min: number, name: string) {
        if (n < min) throw new Error(`${name} cannot be less than ${min}`);
    }

    export function max(n: number, max: number, name: string) {
        if (n > max) throw new Error(`${name} cannot be greater than ${max}`);
    }

    export function inRange(n: number, min: number, max: number, name: string) {
        Check.min(n, min, name);
        Check.max(n, max, name);
    }

    export function oneOf<T>(obj: T, options: Array<T>, name: string) {
        if (!options.includes(obj)) throw new Error(`${name} must be one of ${options.toString()}`);
    }

}

export namespace Model {

    export interface DiscordUser {
        id: string;
        name: string;
        discriminator: number;
    }

    export interface User {
        _id: string;
        name: string;
        discord: DiscordUser | undefined;
        permissions: Array<string>;
        roles: Array<string>;
    }

    export interface Role {
        _id: string;
        name: string;
        description: string;
        permissions: Array<string>;
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
        required: Array<string>;
        /**
         * Any additional permissions to give the subject while checking.
         * For example: If we specify ['*'] as additional permissions then all checks will always pass,
         * even if the subject does not have the required permissions. Because when they are checked,
         * the '*' flag is temporarily added to the subjects permissions.
         */
        additional: Array<string>;
        // If the response should include missing permissions, leave as false if you do not intent to use them
        includeMissing: boolean;
    }

    // Represents a response from the API when checking permissions
    export interface CheckResult {
        // If the subject had all the required permissions
        passed: boolean;
        /**
         * If the user did not have any missing permissions, and the 'includeMissing' field was set to true in
         * the request then this field will have all the permissions the subject was missing, otherwise undefined/null
         */
        missing: Array<Flag> | undefined;
    }

    // Our lord an savior Ash has come to bless us
    export class Flag extends String {
        isWildcard: boolean;
        keys: Array<string>;

        constructor(value: string) {
            Check.flag(value);
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


}