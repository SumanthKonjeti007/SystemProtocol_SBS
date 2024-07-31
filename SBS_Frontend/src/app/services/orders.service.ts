import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from './orders'; 
import { account } from './account';

export interface OrderResponse {
  razorpayOrderId: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private baseUrl = 'https://192.168.1.9:4005/api/payment/orders'; // Base URL for the payment API

  constructor(private http: HttpClient) {}

  // Method for merchants to request payment from customers
  createPaymentRequest(orderRequest: Order): Observable<any> {
    return this.http.post<any>(`https://192.168.1.9:4005/api/payment/orders/requestPayment`, orderRequest);
  }

  // Method for customers to make payment to merchants
  executePaymentToMerchant(orderRequest: Order, customerAccount: account, orderId: number|undefined): Observable<any> {
    const combinedRequest = {
      ...orderRequest,
      transactionType: "PAYMENT",
      orderId: orderId,
      customerAccountNumber: customerAccount.accountNumber,
    };
    console.log("helloo", combinedRequest);
    return this.http.post<any>(`https://192.168.1.9:4005/api/payment/orders/paymentGateway`, combinedRequest);
  }
}