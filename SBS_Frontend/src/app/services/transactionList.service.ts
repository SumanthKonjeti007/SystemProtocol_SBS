import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { transaction } from './transaction'; // Adjust the import path as necessary


@Injectable({
  providedIn: 'root'
})
export class TransactionListService {   
    private baseUrl = 'http://localhost:8080/api/v1/transaction/';
    constructor(private http: HttpClient) { }

    getAllTransactions(): Observable<transaction[]> {
        //const url = this.baseUrl + 'allTransactions';
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            }),
            responseType: 'text' as 'json' // Specify the response type as text
          };
          return this.http.get<transaction[]>(`${this.baseUrl}allTransactions`)
      .pipe(
        tap((transactions: transaction[]) => console.log('Fetched users:', transactions)), // Log the users for verification
        catchError((error: any) => {
          console.error('Error from backend:', error);
          return throwError(error);
        })
      );
  }


//   acceptTransaction(transactionId: number): Observable<any> {
//     // Simulate API call for accepting a transaction
//     const index = this.transactions.findIndex(t => t.transactionId === transactionId);
//     if (index !== -1) {
//       this.transactions[index].status = 'Verified';
//       // Simulate API response
//       return of({ success: true, message: `Transaction ${transactionId} verified` });
//     } else {
//       return of({ success: false, message: 'Transaction not found' });
//     }
//   }

  acceptTransaction(transactionId: number, username: string): Observable<any> {
    const url = this.baseUrl + 'approveRequest';
    const body = {
      transaction: {
        transactionId: transactionId
      },
      user: {
        username: username
      }
    };
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'text' as 'json' // Specify the response type as text
      };
    
    return this.http.post(url, body, httpOptions);
  }

  rejectTransaction(transactionId: number, username: string): Observable<any> {
    const url = this.baseUrl + 'rejectRequest';
    const body = {
      transaction: {
        transactionId: transactionId
      },
      user: {
        username: username
      }
    };
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'text' as 'json' // Specify the response type as text
      };
    
    return this.http.post(url, body, httpOptions);
  }


  deactivateUser(userId: any): Observable<any> {
    const url = `${this.baseUrl}deactiveUser?id=${userId}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
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

}
