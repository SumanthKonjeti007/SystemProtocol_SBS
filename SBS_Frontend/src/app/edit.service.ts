import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { transaction } from './services/transaction';

@Injectable({
  providedIn: 'root'
})
export class EditService {
  private baseUrl = 'http://localhost:8080/api/v1/transaction/';

  constructor(private http: HttpClient) { }

  getTransactionById(transactionId: number): Observable<transaction> {
    return this.http.get<transaction>(`${this.baseUrl}${transactionId}`);
  }

  updateTransaction(transaction: transaction): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}${transaction.transactionId}`, transaction);
  }
}
