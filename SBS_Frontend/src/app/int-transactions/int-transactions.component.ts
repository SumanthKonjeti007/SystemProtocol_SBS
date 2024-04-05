import { NavigationEnd, Route, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { JwtHelperService } from '../services/jwt-helper.service';
import { UserRoles } from '../user-roles';


@Component({
  selector: 'app-int-transactions',
  templateUrl: './int-transactions.component.html',
  styleUrls: ['./int-transactions.component.css']
})
export class IntTransactionsComponent implements OnInit {
  accountNumber: string = '';
  transactions: any[] = [];
  showAll: boolean = false;
  

  
  constructor(private transactionService: TransactionService, private router: Router, private jwtHelper: JwtHelperService) { }
 
  ngOnInit(): void {
    this.jwtHelper.checkSessionValidity(UserRoles.internal);
     
      
  }


  onSubmit(): void {
     
      this.transactionService.getTransactionsByAccountNumber(this.accountNumber).subscribe((data: any[]) => {
        this.transactions = data;
       } );
  
  }

  onRadioChange(event: any): void {
    this.showAll = event.target.checked;
    if(this.showAll) {
      this.transactionService.getAllTransactionsInternalUser().subscribe((data: any[]) => {
        this.transactions = data;
      });
    }
    
  }
  updateTransaction(transaction : any){
    console.log(transaction);
    this.router.navigate(['edit-Transaction'], { state: { transaction: transaction } });
  }
}
