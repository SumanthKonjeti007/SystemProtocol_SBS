import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { transaction } from './services/transaction';

@Injectable({
  providedIn: 'root'
})
export class EditService {
  private baseUrl = 'http://localhost:8081/api/v1/transaction/';
  private token = localStorage.getItem('jwtToken') || null;

  constructor(private http: HttpClient) { }

  updateTransaction(transaction: transaction): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };
    
    return this.http.post<any>(`${this.baseUrl}updateTransaction`,transaction, httpOptions);
  }
}
