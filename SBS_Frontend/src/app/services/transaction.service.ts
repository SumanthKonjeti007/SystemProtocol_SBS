
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { transaction } from './transaction'; // Ensure this is the correct import path

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = 'http://localhost:8080/api/v1/';
  private token = localStorage.getItem('jwtToken') || null;

  constructor(private http: HttpClient) { }

  getTransactionsByAccountNumber(accountNumber: string): Observable<transaction[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };
    return this.http.get<transaction[]>(`${this.baseUrl}transaction/allTransactionbyAccount?accNumber=${accountNumber}`,httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllTransactionsInternalUser(): Observable<transaction[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };
    return this.http.get<transaction[]>(`${this.baseUrl}transaction/allTransactions`,httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllTransactions(userId: number): Observable<transaction[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };
    return this.http.get<transaction[]>(`${this.baseUrl}transaction/allTransactions?userId=${userId}`,httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('An error occurred; please try again later.'));
  }
}
