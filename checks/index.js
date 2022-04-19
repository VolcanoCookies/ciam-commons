export const objectIdRegex = /[a-f0-9]{24}/;
export const discordIdRegex = /\d{16,20}/;
export const flagRegex = /^(?:([a-z0-9]+|\?)(?:\.(?:[a-z0-9]+|\?))*(\.\*)?|\*)$/;
export const strictFlagRegex = /^[a-z0-9]+(\.[a-z0-9]+)*$/;
export class CheckError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CheckError';
    }
}
export function objectId(id, message = 'Invalid objectId') {
    if (!id.match(objectIdRegex))
        throw new CheckError(`${message} "${id}"`);
}
export function discordId(id, message = 'Invalid discordId') {
    if (!id.match(discordIdRegex))
        throw new CheckError(`${message} "${id}"`);
}
export function flag(flag, message = 'Invalid permission flag') {
    if (!flag.match(flagRegex))
        throw new CheckError(`${message} "${flag}"`);
}
export function strictFlag(flag, message = 'Invalid strict permission flag') {
    if (!flag.match(strictFlagRegex))
        throw new CheckError(`${message} "${flag}"`);
}
export function notEmpty(obj, name) {
    if (obj.length == 0)
        throw new CheckError(`${name} cannot be empty`);
}
export function min(n, min, name) {
    if (n < min)
        throw new CheckError(`${name} cannot be less than ${min}`);
}
export function max(n, max, name) {
    if (n > max)
        throw new CheckError(`${name} cannot be greater than ${max}`);
}
export function inRange(n, minVal, maxVal, name) {
    min(n, minVal, name);
    max(n, maxVal, name);
}
export function oneOf(obj, options, name) {
    if (!options.includes(obj))
        throw new CheckError(`${name} must be one of ${options.toString()}`);
}
