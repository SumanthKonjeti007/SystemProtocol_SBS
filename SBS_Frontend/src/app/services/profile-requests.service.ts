import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { transaction } from '../services/transaction';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileRequestsService {

  private baseUrl = 'http://localhost:8080/api/v1/';
  apiURL: any;
  
  constructor(private http: HttpClient) {}

  
  
  getPendingProfileRequests(): Observable<transaction[]> {
    return this.http.get<transaction[]>(`${this.baseUrl}transaction/pendingProfileRequests`);
  }



}
