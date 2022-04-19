export declare const objectIdRegex: RegExp;
export declare const discordIdRegex: RegExp;
export declare const flagRegex: RegExp;
export declare const strictFlagRegex: RegExp;
export declare class CheckError extends Error {
    constructor(message: string);
}
export declare function objectId(id: string, message?: string): void;
export declare function discordId(id: string, message?: string): void;
export declare function flag(flag: string, message?: string): void;
export declare function strictFlag(flag: string, message?: string): void;
export declare function notEmpty(obj: string | Array<any>, name: string): void;
export declare function min(n: number, min: number, name: string): void;
export declare function max(n: number, max: number, name: string): void;
export declare function inRange(n: number, minVal: number, maxVal: number, name: string): void;
export declare function oneOf<T>(obj: T, options: Array<T>, name: string): void;
