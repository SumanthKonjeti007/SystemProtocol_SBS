// Assuming User and Account classes are defined elsewhere, import them
import { user } from './user'; // Adjust path as necessary
import { account } from './account'; // Adjust path as necessary

export class Order {
    orderId?: number; // Optional since it may not be present for a new Order
    razorpayOrderId?: string;
    user?: user;
    senderAcc?: account; // Assuming this is always required when creating an order
    amount?: string; // Assuming amount is always required
    currency: string = 'INR'; // Defaulting to 'INR', mark as non-nullable
    receipt?: string;
    status?: string; // Assuming status is always required, no default value provided here
    createdBy?: string;
    createdtime?: string; // Using string for simplicity, consider converting to Date if needed
    lastModifiedBy?: string;
    lastModifiedtime?: string;

    // Additional properties similar to 'requestPending' and 'deleted' can be added here if needed
}
