import { user } from './user';

export class account {
    accountId: string | undefined;
    user: user | undefined;
    accountNumber!: string;  // The exclamation mark (!) here indicates that the property is non-nullable
    accountType: string | undefined | null;
    balance: string | undefined | null;
    status: string | undefined | null;
    requestPending?: boolean; // Added to track the deletion request state
    deleted?: boolean; // Already present to indicate deletion
}