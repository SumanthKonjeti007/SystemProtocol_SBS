import { Component } from '@angular/core';
import { transaction } from '../../services/transaction';
import { JwtHelperService } from '../../services/jwt-helper.service';
import { TransactionService } from '../../services/transaction.service';
import { UserRoles } from '../../user-roles';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrl: './user-activity.component.css'
})
export class UserActivityComponent {
  transactions: transaction[] = [];
   
  token: string | undefined;
  decodedToken: any;

  constructor(private transactionService: TransactionService, private jwtHelper: JwtHelperService) { }

  ngOnInit(): void {
    if (this.jwtHelper.checkSessionValidity(UserRoles.customer)){
    this.token = localStorage.getItem('jwtToken') || '{}';
      
        this.decodedToken = this.jwtHelper.decodeToken(this.token)
    this.transactionService.getuserActivity(this.decodedToken.userId).subscribe(
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
