import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { account } from './account'; // Adjust the import path as necessary

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl = 'http://localhost:8080/api/v1/account'; // Base URL to your API

  constructor(private http: HttpClient) {}

  getAllAccounts(userId: number): Observable<account[]> {
    // userId = 4;
    const url = `${this.baseUrl}/user/${userId}/accountDetails`; // Dynamic URL including the userId

    return this.http.get<account[]>(url)
      .pipe(
        tap((accounts: account[]) => console.log('Fetched Accounts:', accounts)),
        catchError((error: any) => {
            console.error('Error from backend:', error);
            return throwError(error);
          })
      );
  }
  
  initiateDeleteRequest(userId: number, accountNumber: string): Observable<any> {
    console.log(userId, accountNumber)
    const url = `${this.baseUrl}/DELETE`; // Adjust the endpoint as necessary
    const body = {
      user: {
        userId: userId
      },
      senderAcc: {
        accountNumber: accountNumber
      },
      transactionType: "DELETE",
      amount: 0
    };

    return this.http.post(url, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),  responseType: 'text' as 'json'
    })
      .pipe(
        // tap(response => console.log(`Delete request initiated for account number: ${accountNumber}`, response)),
        catchError(this.handleError) // Using the existing handleError method
      );
  }

  // Add other service methods as needed
  
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => error);
  }
}
