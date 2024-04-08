import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from './orders'; 

// export interface OrderRequest {
//     user: {
//       userId: number | null;
//     };
//     senderAcc: {
//       accountNumber: string;
//     };
//     amount: string;
//     currency: string;
//   }

export interface OrderResponse {
  razorpayOrderId: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private createOrderUrl = 'http://localhost:8080/api/payment/orders/create';

  constructor(private http: HttpClient) {}

  createRazorpayOrder(orderRequest: Order): Observable<OrderResponse> {
     // Set currency to 'INR' by default
    return this.http.post<OrderResponse>(this.createOrderUrl, orderRequest);
  }
}