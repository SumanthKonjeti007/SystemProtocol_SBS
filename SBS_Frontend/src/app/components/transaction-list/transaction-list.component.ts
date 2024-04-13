import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { IntheaderComponent } from '../../shared/intheader/intheader.component';
import { TransactionListService } from '../../services/transactionList.service';
import { transaction } from '../../services/transaction';
import { JwtHelperService } from '../../services/jwt-helper.service'; 
import { UserRoles } from '../../user-roles';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
  transactions : transaction[] = [];
  decodedToken: any | null;

  constructor(private transactionListService: TransactionListService, private jwtHelper: JwtHelperService) {}

  ngOnInit(): void {
    if (this.jwtHelper.checkSessionValidityMultiple(UserRoles.customer,UserRoles.merchant)){
    this.getAllTransactions();
    const token = localStorage.getItem('jwtToken')|| '{}';;
   this.decodedToken = this.jwtHelper.decodeToken(token);
  }
  }

  public getAllTransactions(): void {
    this.transactionListService.getAllTransactions().subscribe(
      (response: transaction[]) => {
        this.transactions = response;
        console.log('Users retrieved:', this.transactions);
      },
      (      error: any) => {
        console.error('There was an error retrieving users:', error);
      }
    );
  }


  acceptTransaction(transactionId: any): void {
    this.transactionListService.acceptTransaction(transactionId, this.decodedToken.username).subscribe({
      next: response => {
        console.log('Transaction approved:', response);
        alert(response);
        // You may want to do something with the approvedTransaction response
        this.getAllTransactions(); // Refresh the transaction list
      },
      error: (error) => {
        console.error('Error approving the transaction:', error);
        // Here you can handle the error based on the status code
        if (error.status === 500) {
          alert("Internal service error");
          // Handle internal server error
        }
      }
    });
  }

  rejectTransaction(transactionId: any): void {
    this.transactionListService.rejectTransaction(transactionId, this.decodedToken.username).subscribe({
      next: response => {
        console.log('Transaction rejected:', response);
        alert(response);
        // You may want to do something with the approvedTransaction response
        this.getAllTransactions(); // Refresh the transaction list
      },
      error: (error) => {
        console.error('Error rejecting the transaction:', error);
        // Here you can handle the error based on the status code
        if (error.status === 500) {
          alert("Internal service error");
          // Handle internal server error
        }
      }
    });
  }
}
