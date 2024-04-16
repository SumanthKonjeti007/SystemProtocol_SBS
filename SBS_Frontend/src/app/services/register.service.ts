import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { user } from './user';
import { Router } from '@angular/router';
import { UserRoles } from '../user-roles';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private patch:any 
  private baseUrl = 'https://156.56.103.237:4005/api/v1/';
  httpOptions: any;
  
  constructor(private http: HttpClient, private router: Router) {}

  register(user: user): Observable<any> {
    
    if (user.role.roleId==UserRoles.internal){
      const token = localStorage.getItem('jwtToken')
      this.patch='createOrUpdateUser'
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }),
        responseType: 'text' as 'json' // Specify the response type as text
      };
    }
    else{
      this.patch='register';
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          
        }),
        responseType: 'text' as 'json' // Specify the response type as text
      };
    }

    const url = this.baseUrl + this.patch;
    console.log(this.httpOptions);
    console.log(url);
    return this.http.post(url, user, this.httpOptions);
    
}

login(username: string, password: string): Observable<user> {
  const url = this.baseUrl + 'login';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })};
  return this.http.post(url, { username, password }, { responseType: 'text' })
    .pipe(map((response: any) => JSON.parse(response)));
}

validateOtp(email: string, otp: string) {
  const url = this.baseUrl + 'validate-otp';
  const body = { email, otp };
  const token = localStorage.getItem('jwtToken')
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }),
    responseType: 'text' as 'json' // Specify the response type as text
  };
  return this.http.post(url, body, httpOptions );
}

generateOtp(email: string) {
  const url = this.baseUrl + 'generate-otp';
  const token = localStorage.getItem('jwtToken')
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }),
    responseType: 'text' as 'json' // Specify the response type as text
  };
  return this.http.post(url, email, httpOptions );
}
  
}
