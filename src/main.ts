export namespace Check {

    export const objectIdRegex: RegExp = /[a-f0-9]{24}/;
    export const flagRegex: RegExp = /^(?:([a-z0-9]+|\?)(?:\.(?:[a-z0-9]+|\?))*(\.\*)?|\*)$/;
    export const strictFlagRegex: RegExp = /^[a-z0-9]+(\.[a-z0-9]+)*$/;

    export function objectId(id: string, message: string = 'Invalid objectId') {
        if (!id.match(objectIdRegex)) throw new Error(`${message} "${id}"`);
    }

    export function flag(flag: string, message: string = 'Invalid permission flag') {
        if (!flag.match(flagRegex)) throw new Error(`${message} "${flag}"`);
    }

    export function strictFlag(flag: string, message: string = 'Invalid strict permission flag') {
        if (!flag.match(strictFlagRegex)) throw new Error(`${message} "${flag}"`);
    }

    export function notEmpty(s: string, name: string) {
        if (s.length == 0) throw new Error(`${name} cannot be empty`);
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

}