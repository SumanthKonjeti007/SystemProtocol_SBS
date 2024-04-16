
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { user } from './user'; // Adjust the import path as necessary


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  private baseUrl = 'https://156.56.103.237:4005/api/v1/';
  constructor(private http: HttpClient) { }
  private token = localStorage.getItem('jwtToken') || null;

  getAllUsers(): Observable<user[]> {
    const url = this.baseUrl + 'admin/users'; // Use a constructed URL from baseUrl
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    return this.http.get<user[]>(`${this.baseUrl}admin/users`,httpOptions)
      .pipe(
        tap((users: user[]) => console.log('Fetched users:', users)), // Log the users for verification
        catchError((error: any) => {
          console.error('Error from backend:', error);
          return throwError(error);
        })
      );
  }

  // Add other service methods as needed

  deactivateUser(userId: any): Observable<any> {
    const url = `${this.baseUrl}deactiveUser?id=${userId}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      }),
      responseType: 'text' as 'json' // Specify the response type as text
    };
    return this.http.post(url, {},httpOptions).pipe(
      tap(_ => console.log(`Deactivated user id=${userId}`)),
      catchError(error => {
        console.error('Error deactivating user:', error);
        return throwError(error);
      })
    );
  }

  activateUser(userId: any): Observable<any> {
    const url = `${this.baseUrl}activateUser?id=${userId}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      }),
      responseType: 'text' as 'json' // Specify the response type as text
    };
    return this.http.post(url,{},httpOptions).pipe(
      tap(_ => console.log(`Activated user id=${userId}`)),
      catchError(error => {
        console.error('Error activating user:', error);
        return throwError(error);
      })
    );

    
  }

// validateOtp(email: string, otp: string) {
//   const url = this.baseUrl + 'validate-otp';
//   const body = { email, otp };
//   const httpOptions = {
//     headers: new HttpHeaders({
//       'Content-Type': 'application/json',
//     }),
//     responseType: 'text' as 'json' // Specify the response type as text
//   };
//   return this.http.post(url, body, httpOptions );
// }
}
