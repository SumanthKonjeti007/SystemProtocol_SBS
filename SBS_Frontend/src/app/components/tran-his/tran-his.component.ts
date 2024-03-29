import { Component, OnInit } from '@angular/core';
//import {TransactionService } from './transaction.service';
import { TransactionService } from '../../services/transaction.service';
import { transaction } from '../../services/transaction';
import { decodeToken } from '../../util/jwt-helper';

@Component({
  selector: 'app-tran-his',
  templateUrl: './tran-his.component.html',
  styleUrls: ['./tran-his.component.css']
})
export class TranHisComponent implements OnInit {
  transactions: transaction[] = [];
   
  token: string | undefined;
  decodedToken: any;

  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('jwtToken') || '{}';
      
        this.decodedToken = decodeToken(this.token)
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

