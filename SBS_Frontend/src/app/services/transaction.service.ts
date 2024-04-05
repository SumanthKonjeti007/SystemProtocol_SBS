
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { transaction } from './transaction'; // Ensure this is the correct import path

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = 'http://localhost:8080/api/v1/';

  constructor(private http: HttpClient) { }

  getTransactionsByAccountNumber(accountNumber: string): Observable<transaction[]> {
    return this.http.get<transaction[]>(`${this.baseUrl}transaction/allTransactionbyAccount?accNumber=${accountNumber}`)
      .pipe(catchError(this.handleError));
  }

  getAllTransactionsInternalUser(): Observable<transaction[]> {
    return this.http.get<transaction[]>(`${this.baseUrl}transaction/allTransactions`)
      .pipe(catchError(this.handleError));
  }

  getAllTransactions(userId: number): Observable<transaction[]> {
    return this.http.get<transaction[]>(`${this.baseUrl}transaction/allTransactions?userId=${userId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('An error occurred; please try again later.'));
  }
}
