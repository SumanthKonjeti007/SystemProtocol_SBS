import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { NgForm } from '@angular/forms';
import { user } from '../../services/user'; // Update import paths if necessary
import { Order } from '../../services/orders'; // Update import paths if necessary
import { JwtHelperService } from '../../services/jwt-helper.service'; 
import { account } from '../../services/account'; // Update import paths if necessary
import { UserRoles } from '../../user-roles';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-payment',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrderComponent implements OnInit {
  user: user = new user();
  order: Order = new Order();
  accounts: account[] = [];
  customerAccount = new account();
  userRoles = UserRoles;
  senderAcc: account = new account();
  accountNumbers: string[] = []; 
  decodedToken: any;
  paidOrders: Set<number> = new Set();
  order_Id: number|undefined;

  constructor(private ordersService: OrdersService, private jwtHelper: JwtHelperService, private route: ActivatedRoute, 
    private accountService: AccountService) {}

  ngOnInit(): void {
    // Extract the token from localStorage and decode it
    const token = localStorage.getItem('jwtToken') || '{}';
    this.decodedToken = this.jwtHelper.decodeToken(token);
    // Initialize userId from the decoded token
    this.user.userId = this.decodedToken?.userId;
    
    this.route.queryParams.subscribe(params => {
      // if (params['accountNumber']) {
      //   this.senderAcc.accountNumber = params['accountNumber'];
      // }
      if (params['amount']) {
        this.order.amount = params['amount'];
        this.order_Id = params['orderId'];
      }
    });
  }

  getUserRole(): number {
    return this.decodedToken?.role || 0;
  }

  makePayment(form: NgForm): void {
    const role = this.getUserRole();
    if (role === this.userRoles.merchant) {
      this.requestPayment(form);
    } else if (role === this.userRoles.customer) {
      this.payToMerchant(form);
    } else {
      console.error('Unsupported role');
    }
  }

  requestPayment(form: NgForm): void {
    // Handle the request payment logic for merchants
    if (form.valid) {

      console.log(form.value);
      this.senderAcc.accountNumber = form.value.senderAcc;
      this.order.senderAcc = this.senderAcc;

      this.user.userId = this.decodedToken?.userId;
      this.order.user = this.user;

      this.order.amount = form.value.amount;
      this.order.currency = 'INR';
      console.log(this.order);

      // Add the logic for merchants to request payment
      console.log('Requesting payment:', this.order);
      this.ordersService.createPaymentRequest(this.order).subscribe({
        next: (response) => {
          // Handle the successful payment request
          console.log('Payment request successful', response);
        },
        error: (error) => {
          // Handle errors
          console.error('Error:', error);
        }
      });
    }
  }

payToMerchant(form: NgForm): void {
  if (form.valid) {
    console.log(form.value);
    this.order.amount = form.value.amount;

    this.senderAcc.accountNumber = form.value.senderAcc;
    this.order.senderAcc = this.senderAcc;

    this.user.userId = this.decodedToken?.userId;
    this.order.user = this.user;

    this.order.currency = 'INR';
    if (this.user.userId) {
      this.accountService.getAllAccounts(this.user.userId).subscribe(
        //here the customer can have multiple accounts, so the accounts are selected based on the amount request. 
        //SenderAcc is merchant's account which will be coming from Ui
        //The customer's account is selected with balance
        response => {
          const sufficientBalanceAccount = response.accounts.find(acc => acc.balance >= form.value.amount);
          if (sufficientBalanceAccount) {
            this.customerAccount = sufficientBalanceAccount;

            console.log('Paying to merchant:', this.order, this.order.senderAcc, sufficientBalanceAccount);

            this.ordersService.executePaymentToMerchant(this.order, this.customerAccount, this.order_Id).subscribe({
              next: (response) => {
                console.log('Payment to merchant successful', response);
                alert(response.message || 'Payment to merchant processed successfully.'); // Alert the user
                // Handle further actions after a successful payment here
                console.log(this.order.orderId);
                if (this.order.orderId) {
                  console.log(this.order, this.order.orderId, 'Paid');
                  this.updateOrderStatus(this.order, this.order.orderId, 'Paid'); // Ensure orderId is a number and is defined
                } else {
                  console.error('Order ID is undefined');
                }
              },
              error: (error) => {
                console.error('Error:', error);
                alert('Failed to process payment. ' + error.message); // Alert the user in case of error
              }
            });
          } else {
            console.error('No accounts with sufficient balance to make the payment');
            alert('No accounts with sufficient balance to make the payment.'); // Alert the user if balance is insufficient
            // Handle the case when there is no account with sufficient balance
          }
        },
        error => {
          console.error('Error fetching account details:', error);
          alert('Error fetching account details: ' + error.message);
        }
      );
    } else {
      console.error('User ID is undefined');
      alert('User identification failed.');
    }
  }
}

isOrderPaid(orderId: number): boolean {
  return this.paidOrders.has(orderId);
}

private updateOrderStatus(or: Order, orderId: number,  status: string): void {
  // Find the order in your orders list and update its status
  if (or) {
    or.status = status;
  }
}

}