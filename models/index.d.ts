import { Flag } from './Permission';
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
export interface CheckRequest {
    type: 'user' | 'role' | 'discordUser';
    id: string;
    required: Array<string>;
    /**
     * Any additional permissions to give the subject while checking.
     * For example: If we specify ['*'] as additional permissions then all checks will always pass,
     * even if the subject does not have the required permissions. Because when they are checked,
     * the '*' flag is temporarily added to the subjects permissions.
     */
    additional: Array<string>;
    includeMissing: boolean;
}
export interface CheckResult {
    passed: boolean;
    /**
     * If the user did not have any missing permissions, and the 'includeMissing' field was set to true in
     * the request then this field will have all the permissions the subject was missing, otherwise undefined/null
     */
    missing: Array<Flag> | undefined;
}
