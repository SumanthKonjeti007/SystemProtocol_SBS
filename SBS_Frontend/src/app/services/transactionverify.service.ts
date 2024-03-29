import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionverifyService {

  private apiUrl = 'http://localhost:8080/api/v1/transaction'; // Base URL for API

  constructor(private http: HttpClient) { }

  fetchTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/allTransactions`);
  }

  verifyTransaction(transactionId: number, username: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/approveRequest`, {
      transaction: { transactionId: transactionId },
      user: { username: username },
    });
  }

  rejectTransaction(transactionId: number, username: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/rejectRequest`, {
      authorizationId: transactionId,
      user: { username: username },
    });
  }
}
