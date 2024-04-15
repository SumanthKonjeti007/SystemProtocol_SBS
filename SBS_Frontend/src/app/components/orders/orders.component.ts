import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { NgForm } from '@angular/forms';
import { user } from '../../services/user'; // Update import paths if necessary
import { Order } from '../../services/orders'; // Update import paths if necessary
import { JwtHelperService } from '../../services/jwt-helper.service'; 
import { account } from '../../services/account'; // Update import paths if necessary
import { UserRoles } from '../../user-roles';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { RegisterService } from '../../services/register.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-payment',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrderComponent implements OnInit {
  @ViewChild('otpDialog') otpDialog!: TemplateRef<any>;
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
  dialogRef!: MatDialogRef<any>;
  otp: string = '';

  constructor(private ordersService: OrdersService, private jwtHelper: JwtHelperService, private route: ActivatedRoute, 
    private accountService: AccountService, private registerService: RegisterService, private dialog: MatDialog) {}

  ngOnInit(): void {
    if (this.jwtHelper.checkSessionValidityMultiple(UserRoles.customer, UserRoles.merchant)) {
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
}

  getUserRole(): number {
    return this.decodedToken?.role || 0;
  }

  makePayment(form: any): void {
    console.log("makepayment")
    const role = this.getUserRole();
    console.log(role)
    if (role === this.userRoles.merchant) {
      this.requestPayment(form);
    } else if (role === this.userRoles.customer) {
      this.payToMerchant(form);
    } else {
      console.error('Unsupported role');
    }
  }

  submitTransaction(form: NgForm) {
    if (form.valid) {
      this.generateOtp(); // Call generateOtp() to initiate OTP generation
    }
    
  }

  generateOtp() {
    this.registerService.generateOtp(this.decodedToken.email).subscribe(
      (response: any) => {
        console.log('OTP generation response:', response);
        this.dialogRef = this.dialog.open(this.otpDialog);
        
      },
      (error: any) => {
        console.error('OTP generation error:', error);
        alert("Error generating OTP.");
      }
    );
  }

  validateOTP() {
    const form = {...this.order}; // Creating a copy of the order data
    console.log(form)
    this.registerService.validateOtp(this.decodedToken.email, this.otp).subscribe(
      (response: any) => {
        console.log('OTP validation response:', response);
        alert('OTP is valid!');
        this.dialogRef.close();
        console.log(form)
        this.makePayment(form); // Proceed with the payment using the form data
      },
      (error: any) => {
        console.error('OTP validation error:', error);
        alert("INVALID OTP, request not created");
        this.dialogRef.close();
      }
    );
  }  

  requestPayment(form: any): void {
    // Handle the request payment logic for merchants
    console.log("in request payment out")
    // if (form.valid) {
      console.log("in request payment")
      console.log(form.value);
      this.senderAcc.accountNumber = form.senderAcc;
      this.order.senderAcc = this.senderAcc;

      this.user.userId = this.decodedToken?.userId;
      this.order.user = this.user;

      this.order.amount = form.amount;
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
    // }
  }

payToMerchant(form: any): void {
  console.log("in payToMerchant out")
  // if (form.valid) {
    console.log("in payToMerchant")
    console.log(form)
    this.order.amount = form.amount;

    this.senderAcc.accountNumber = form.senderAcc;
    this.order.senderAcc = this.senderAcc;

    this.user.userId = this.decodedToken?.userId;
    this.order.user = this.user;

    this.order.currency = 'INR';
    console.log(this.order)
    if (this.user.userId) {
      this.accountService.getAllAccounts(this.user.userId).subscribe(
        //here the customer can have multiple accounts, so the accounts are selected based on the amount request. 
        //SenderAcc is merchant's account which will be coming from Ui
        //The customer's account is selected with balance
        response => {
          const sufficientBalanceAccount = response.accounts.find(acc => acc.balance >= form.amount);
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
  // }
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
