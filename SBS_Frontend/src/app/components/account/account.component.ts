import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service'; // Adjust the path as necessary
import { account } from '../../services/account'; // Ensure this model supports a 'deleted?' boolean property
import { CommonModule } from '@angular/common';
import { user } from '../../services/user';
import { JwtHelperService } from '../../services/jwt-helper.service'; 
import { UserRoles } from '../../user-roles';

@Component({
  selector: 'app-user-list',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  
  constructor(private accountService: AccountService, private jwtHelper: JwtHelperService) {}
  accounts: account[] = [];
  user = new user();
  userId: number | null = null;
  token = localStorage.getItem('jwtToken')|| '{}';
  decodedToken = this.jwtHelper.decodeToken(this.token);

  ngOnInit(): void {
    if (this.jwtHelper.checkSessionValidity(UserRoles.customer)){
    // const token = localStorage.getItem('jwtToken');
    if (this.token) {
      // Decode the JWT token to get the userId
      // const decodedToken = decodeToken(thtoken);
      const userId = this.decodedToken?.userId;
      if (userId) {
        this.getAccounts(userId);
      } else {
        console.error('User ID is not present in the decoded token');
      }
    } else {
      console.error('JWT Token not found in local storage');
    }
  }
  }

  public getAccounts(userId: number): void {
    this.accountService.getAllAccounts(userId).subscribe(
      (response: any) => {
        this.accounts = response.accounts;
        console.log('Accounts retrieved:', this.accounts);
      },
      error => {
        console.error('There was an error retrieving accounts:', error);
      }
    );
  }

  // Add the markAsDeleted method here
  public initiateDeleteRequest(index: number): void {
    const accountToDelete: account = this.accounts[index];

    if (accountToDelete && accountToDelete.accountNumber && this.decodedToken?.userId) {
      //console.log(accountToDelete);
      console.log("Hello")
      this.accountService.initiateDeleteRequest(this.decodedToken?.userId, accountToDelete.accountNumber)
      .subscribe({
          next: (response: any) => {
          //console.log('Transaction successful', response);
          console.log('Response from backend:', response);
          if (typeof response === 'string' && response.endsWith('created successfully')) {
            //console.log('User signed up successfully!');
            alert('Request created successfully!');
            accountToDelete.requestPending = true;
            console.log(accountToDelete);
          }
          else{
            console.error('Unexpected response from backend:', response);
            alert('Unexpected response from backend');
          }
          // Handle successful transaction here (e.g., display a success message)
        },
        error: (error) => {
          console.error('Transaction failed', error);
          accountToDelete.requestPending = false;
          // Handle transaction failure here (e.g., display an error message)
        }
      });
    }
  }

  // public updateAccountStatus(accountId: number, newStatus: string): void {
  //   const account = this.accounts.find(acc => acc.accountId === accountId);
  //   if (account) {
  //     account.status = newStatus;
  //     if (newStatus === 'INACTIVE') {
  //       account.deleted = true; // This property should control the strike-through styling
  //     }
  //   }
  // }

}
