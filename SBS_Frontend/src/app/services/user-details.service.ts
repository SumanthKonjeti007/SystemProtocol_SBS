import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {
  private apiUrl = 'http://localhost:8080/api/v1'; // Replace with your actual API URL
  private token = localStorage.getItem('jwtToken') || null;

  constructor(private http: HttpClient) { }

  getUserDetails(): Observable<any[]> {
    const url = `${this.apiUrl}/admin/users`; // Adjust the endpoint based on your API
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }),
    };
    return this.http.get<any[]>(url,httpOptions);
  }
}

