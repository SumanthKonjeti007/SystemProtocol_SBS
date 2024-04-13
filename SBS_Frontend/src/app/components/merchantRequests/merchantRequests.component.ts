import { Component, OnInit } from '@angular/core';
import { Order } from '../../services/orders';
import { user } from '../../services/user'; // Correct import if 'User' is the actual class name
import { account } from '../../services/account'; // Correct import if 'Account' is the actual class name
import { UserRoles } from '../../user-roles';
import { JwtHelperService } from '../../services/jwt-helper.service';
import { AccountService } from '../../services/account.service';
import { MerchantRequestsService } from '../../services/merchantRequests.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-details',
  templateUrl: './merchantRequests.component.html',
  styleUrls: ['./merchantRequests.component.css']
})
export class MerchantRequestsComponent implements OnInit {
  allOrders: Order[][] = [];
  user = new user(); // Use 'new User()' if 'User' is the actual class name
  senderAcc: account[] = []; // Use 'new Account()' if 'Account' is the actual class name
  accountNumbers: string[] = []; // Added to store account numbers
  userId: number | null = null;
  token = localStorage.getItem('jwtToken') || '{}';
  decodedToken = this.jwtHelper.decodeToken(this.token);

  constructor(
    private jwtHelper: JwtHelperService,
    private accountService: AccountService,
    private merchantRequestsService: MerchantRequestsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.jwtHelper.checkSessionValidityMultiple(UserRoles.customer, UserRoles.merchant)) {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        const userId = this.decodedToken?.userId; // Implement decodeToken to extract userId from the token
        if (userId) {
          this.accountService.getAllAccounts(userId).subscribe(
            response => {
              // Use the 'accounts' property of the response
              this.senderAcc = response.accounts;
              this.accountNumbers = response.accounts.map(acc => acc.accountNumber);
              console.log("Account Numbers:", this.accountNumbers);
      
              // Now you can call the method to fetch payment details with all accountNumbers
              this.fetchAllPaymentDetails(this.accountNumbers);
            },
            error => {
              console.error('Error fetching account details:', error);
            }
          );
        } else {
          console.error('User ID is not present in the decoded token');
        }
      } else {
        console.error('JWT Token not found in local storage');
      }
    }
  }

  private fetchAllPaymentDetails(accountNumbers: string[]): void {
    console.log("hi2", accountNumbers);
    // Assuming 'getAllOrderDetails' takes an array of accountNumbers and returns an array of Order[]
    this.merchantRequestsService.getAllOrderDetails(accountNumbers).subscribe(
      allOrders => {
        this.allOrders = allOrders; // Assigning the fetched orders to the component's property
        console.log('All account details retrieved:', this.allOrders);
      },
      error => {
        console.error('There was an error retrieving orders for the accounts:', error);
      }
    );
  }

  // redirectToPaymentGateway(accountNumber: string | undefined, amount: string | undefined): void {
  //   if (accountNumber && amount !== undefined) {
  //     this.router.navigate(['/payment-gateway'], { queryParams: { accountNumber, amount } });
  //   } else {
  //     console.error('Account number or amount is undefined.');
  //   }
  // }
  redirectToPaymentGateway( amount: string | undefined, orderId: number | undefined): void {
    if (amount !== undefined) {
      this.router.navigate(['/payment-gateway'], { queryParams: { amount: amount, orderId: orderId } });
    } else {
      console.error('Account number or amount is undefined.');
    }
  }

}
