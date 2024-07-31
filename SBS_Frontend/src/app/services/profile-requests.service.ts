import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { transaction } from '../services/transaction';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileRequestsService {

  private baseUrl = 'https://192.168.1.9:4005/api/v1/';
  private token = localStorage.getItem('jwtToken') || null;
  apiURL: any;
  
  constructor(private http: HttpClient) {}

  
  
  getPendingProfileRequests(): Observable<transaction[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };
    return this.http.get<transaction[]>(`${this.baseUrl}transaction/pendingProfileRequests`,httpOptions);
  }

  updateUserProfile(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };
    const url = `${this.baseUrl}transaction/updateUserProfile`;
    return this.http.post(url, data,httpOptions);
  }

}
