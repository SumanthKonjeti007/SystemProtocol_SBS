import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { NgForm } from '@angular/forms';
import { user } from '../../services/user'; // Update import paths if necessary
import { Order } from '../../services/orders'; // Update import paths if necessary
import { JwtHelperService } from '../../services/jwt-helper.service'; 
import { account } from '../../services/account'; // Update import paths if necessary

declare var Razorpay: any;

@Component({
  selector: 'app-payment',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrderComponent implements OnInit {
user = new user();
  order = new Order();
  senderAcc = new account(); // Assuming `Account` is a class with required properties
  userId: number | null = null;
  token = localStorage.getItem('jwtToken')|| '{}';;
  decodedToken = this.jwtHelper.decodeToken(this.token);

  constructor(private ordersService: OrdersService, private jwtHelper: JwtHelperService) {}

  ngOnInit(): void {
    // If your token decoding logic is synchronous, you can directly assign to `userId`
    const userId = this.decodedToken?.userId;
  }

  makePayment(form: NgForm): void {
    if (form.valid) {
        console.log(form.value);
        // if (!form.value.amount || !form.value.account) {
        //     alert("Please enter a valid amount and account number");
        //     return;
        //   }
        this.senderAcc.accountNumber = form.value.senderAcc;
        this.order.senderAcc = this.senderAcc;

        this.user.userId = this.decodedToken?.userId;
        this.order.user = this.user;

        this.order.amount = form.value.amount;
        this.order.currency = 'INR';
        console.log(this.order);

    this.ordersService.createRazorpayOrder(this.order).subscribe({
      next: (response) => {
        console.log(response);
        // Initialize Razorpay checkout here using the `options` object
        const rzp1 = new Razorpay(this.getRazorpayOptions(response.razorpayOrderId));
        rzp1.open();
      },
      error: (error) => {
        console.error('Error:', error);
        alert('Failed to initiate payment');
      },
    });
}}

private getRazorpayOptions(orderId: string): any {
    return {
      key: "rzp_test_HBDfaKCfV3ywwP", // Use the correct key for production
      amount: Number(this.order.amount) * 100, // Amount in currency subunits
      currency: "INR",
      name: "Razorpay",
      description: "Test Transaction",
      order_id: orderId, // The ID returned from the server after order creation
      handler: (response: any) => {
        alert("Payment successful. Razorpay payment Id: " + response.razorpay_payment_id);
        // Implement post-payment logic here
      },
      prefill: {
        name: "Amazon",
        email: "amazon@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
      // Add display property for QR code
      display: {
        qr_code: true, // Make sure QR codes are enabled for your Razorpay account
      },
    };
  }
  
}


// import { Component, OnInit } from '@angular/core';
// import { OrdersService } from '../../services/orders.service';
// import { NgForm } from '@angular/forms';
// import { user } from '../../services/user';
// import { Order } from '../../services/orders';
// import { decodeToken } from '../../util/jwt-helper';
// import { account } from '../../services/account';

// declare let Razorpay: any;

// @Component({
//   selector: 'app-payment',
//   templateUrl: './orders.component.html',
//   styleUrls: ['./orders.component.css']
// })
// export class OrderComponent implements OnInit {
//   user = new user();
//   order = new Order();
//   senderAcc = new account();
//   userId: number | null = null;
//   token: string;
//   decodedToken: any;

//   constructor(private ordersService: OrdersService) {
//     this.token = localStorage.getItem('jwtToken') || '{}';
//     this.decodedToken = decodeToken(this.token);
//   }

//   ngOnInit(): void {
//     this.userId = this.decodedToken?.userId;
//   }

//   makePayment(form: NgForm): void {
//     if (form.valid) {
//       this.senderAcc.accountNumber = form.value.senderAcc;
//       this.order.senderAcc = this.senderAcc;
//       this.user.userId = this.decodedToken?.userId;
//       this.order.user = this.user;
//       this.order.amount = form.value.amount;
//       this.order.currency = 'INR';

//       this.ordersService.createRazorpayOrder(this.order).subscribe({
//         next: (response) => {
//           const options = this.getRazorpayOptions(response.razorpayOrderId);
//           options.prefill.name = "Customer Name";
//           options.prefill.email = "customer@example.com";
//           options.prefill.contact = "9999999999";
//           options.image = "https://your-logo-url.com/logo.png"; // Add your logo URL here

//           const rzp = new Razorpay(options);
//           rzp.on('payment.failed', function (response: any) {
//             console.log(response.error.code);
//             console.log(response.error.description);
//             alert('Failed to initiate payment');
//           });
//           rzp.open();
//         },
//         error: (error) => {
//           console.error('Error:', error);
//           alert('Failed to initiate payment');
//         },
//       });
//     }
//   }

//   private getRazorpayOptions(orderId: string): any {
//     return {
//       key: "rzp_test_HBDfaKCfV3ywwP", // Replace with your actual key for production
//       amount: Number(this.order.amount) * 100, // Amount in currency subunits
//       currency: "INR",
//       name: "AMAZON",
//       description: "Test Transaction",
//       image: "https://www.javachinna.com/wp-content/uploads/2020/02/android-chrome-512x512-1.png", // Replace with your image URL
//       order_id: orderId,
//       handler: (response: any) => {
//         alert("Payment successful. Razorpay payment Id: " + response.razorpay_payment_id);
//         // Implement post-payment logic here
//       },
//       prefill: {
//         // Prefill details will be set during the makePayment method call
//       },
//       notes: {
//         address: "Razorpay Corporate Office",
//       },
//       theme: {
//         color: "#3399cc",
//       },
//       // Add display property for QR code
//       display: {
//         qr_code: true, // Enable QR code display
//       },
//     };
//   }
// }