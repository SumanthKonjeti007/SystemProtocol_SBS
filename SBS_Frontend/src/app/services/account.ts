import { user } from './user';

export class account {
    accountId?: string ;
    user?: user | undefined;
    accountNumber!: string;  // The exclamation mark (!) here indicates that the property is non-nullable
    accountType!: string 
    balance!: string 
    status!: string 
    requestPending?: boolean; // Added to track the deletion request state
    deleted?: boolean; // Already present to indicate deletion
}