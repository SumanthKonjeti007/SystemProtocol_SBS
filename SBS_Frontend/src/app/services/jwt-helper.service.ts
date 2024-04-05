import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class JwtHelperService {
  constructor(private router: Router) {}

  decodeToken(token: string): DecodedToken | null {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: decodedToken.userId,
        email: decodedToken.email,
        username: decodedToken.username,
        exp: decodedToken.exp,
        iat: decodedToken.iat,
        role: decodedToken.role
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  removeToken(token: string): void {
    localStorage.removeItem(token);
  }

  isTokenExpired(token: string): boolean {
    const decodedToken = this.decodeToken(token);
    console.log(decodedToken)
    if (decodedToken?.exp === undefined) {
      return false;
    }
    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(decodedToken.exp);
    return expirationDate.valueOf() <= new Date().valueOf();
  }

  checkSessionValidity(role: number | undefined): Boolean {
    const token = localStorage.getItem('jwtToken')|| '{}';
    const decodedToken = this.decodeToken(token)
    if (token && this.isTokenExpired(token) || role != decodedToken?.role) {
      localStorage.removeItem('jwtToken');
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
interface DecodedToken {
  userId: number;
  email: string;
  exp: number;
  username: string;
  iat: number;
  role: number;
}
