import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { transaction } from './transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiURL = 'http://localhost:8080/api/v1/transaction/allTransaction';

  constructor(private http: HttpClient) { }

  getAllTransactions(userId: number): Observable<transaction[]> {
    return this.http.get<transaction[]>(`${this.apiURL}?userId=${userId}`);
  }
}
