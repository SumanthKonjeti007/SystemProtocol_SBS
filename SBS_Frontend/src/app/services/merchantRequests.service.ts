import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, catchError, throwError } from 'rxjs';
import { Order } from './orders'; // Import the correct type

@Injectable({
  providedIn: 'root'
})
export class MerchantRequestsService {
  private apiUrl = 'https://156.56.103.237:4005/api/payment/'; // Use your actual API URL
  private token = localStorage.getItem('jwtToken') || null;

  constructor(private http: HttpClient) { }

  // This method is for getting the details of a single account
  getOrderDetails(accountNumber: string): Observable<Order[]> {
    const httpOptions = this.getHttpOptions();
    return this.http.get<Order[]>(`${this.apiUrl}allOrderTransactionbyAccount?accNumber=${accountNumber}`, httpOptions)
      .pipe(catchError(this.handleError));
  }
  
  // New method to handle multiple accounts
  getAllOrderDetails(accountNumbers: string[]): Observable<Order[][]> {
    const httpOptions = this.getHttpOptions();
    const requests = accountNumbers.map(accNumber =>
      this.http.get<Order[]>(`${this.apiUrl}allOrderTransactionbyAccount?accNumber=${accNumber}`, httpOptions)
    );

    return forkJoin(requests).pipe(catchError(this.handleError));
  }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('An error occurred; please try again later.'));
  }
}
