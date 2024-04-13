import { Component, OnInit } from '@angular/core';
//import {TransactionService } from './transaction.service';
import { TransactionService } from '../../services/transaction.service';
import { transaction } from '../../services/transaction';
import { JwtHelperService } from '../../services/jwt-helper.service'; 
import { UserRoles } from '../../user-roles';

@Component({
  selector: 'app-tran-his',
  templateUrl: './tran-his.component.html',
  styleUrls: ['./tran-his.component.css']
})
export class TranHisComponent implements OnInit {
  transactions: transaction[] = [];
   
  token: string | undefined;
  decodedToken: any;

  constructor(private transactionService: TransactionService, private jwtHelper: JwtHelperService) { }

  ngOnInit(): void {
    if (this.jwtHelper.checkSessionValidityMultiple(UserRoles.customer,UserRoles.merchant)){
    this.token = localStorage.getItem('jwtToken') || '{}';
      
        this.decodedToken = this.jwtHelper.decodeToken(this.token)
    this.transactionService.getAllTransactions(this.decodedToken.userId).subscribe(
      (transactions: transaction[]) => {
        this.transactions = transactions;
        console.log(this.transactions)
      },
      (error: any) => {
        console.error('Error fetching transactions:', error);
      }
    );
  }
  }
}

