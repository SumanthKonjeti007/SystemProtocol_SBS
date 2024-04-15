import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { account } from './account'; // Adjust the import path as necessary

// Interface to reflect the expected structure of the backend response
interface AccountResponse {
  accounts: account[];
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  
  private baseUrl = 'http://localhost:8080/api/v1/account'; // Base URL to your API

  constructor(private http: HttpClient) {}

  // Method updated to return an Observable of AccountResponse
  getAllAccounts(userId: number): Observable<AccountResponse> {
    const url = `${this.baseUrl}/user/${userId}/accountDetails`; // Dynamic URL including the userId
    const token = localStorage.getItem('jwtToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.get<AccountResponse>(url, httpOptions)
      .pipe(
        tap(response => console.log('Fetched Accounts:', response.accounts)),
        catchError((error: any) => {
            console.error('Error from backend:', error);
            return throwError(() => new Error('An error occurred; please try again later.'));
        })
      );
  }
  createAccount(acc: any) {

    const url = `${this.baseUrl}/createAccount`; // Dynamic URL including the userId
    const token = localStorage.getItem('jwtToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),  responseType: 'text' as 'json'
    };
    console.log(acc);
    return this.http.post(url, acc, httpOptions );
  }

  
  initiateDeleteRequest(userId: number, accountNumber: string): Observable<any> {
    console.log(userId, accountNumber)
    const url = `${this.baseUrl}/DELETE`; // Adjust the endpoint as necessary
    const token = localStorage.getItem('jwtToken')
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
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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
