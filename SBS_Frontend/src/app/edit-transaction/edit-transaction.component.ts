import { transaction } from './../services/transaction';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EditService } from '../edit.service'; // Adjust import
import { JwtHelperService } from '../services/jwt-helper.service';
import { UserRoles } from '../user-roles';


@Component({
  selector: 'app-edit-transaction',
  templateUrl: './edit-transaction.component.html',
  styleUrls: ['./edit-transaction.component.css']
})
export class EditTransactionComponent implements OnInit {
  transactionId!: number;
  transaction!: transaction;

  constructor(private route: ActivatedRoute, private editService: EditService, private router: Router, private jwtHelper: JwtHelperService) { }
 
  ngOnInit(): void {
    this.jwtHelper.checkSessionValidity(UserRoles.admin);
      this.transaction = history.state.transaction;
      console.log(this.transaction)
      
  }


  saveChanges(form: NgForm): void {
    console.log(form.value);
    console.log(this.transaction)
    this.editService.updateTransaction(this.transaction).subscribe(
      () => {
        console.log('Transaction updated successfully');
        // Optionally, navigate to another page or show a success message
      },
      error => {
        console.error('Error updating transaction:', error);
        // Handle error
      }
    );
    this.router.navigate(['/int-transactions']);
  }

  updateReceiverAccount(accountNumber: string) {
    if (this.transaction && this.transaction.receiverAcc) {
        this.transaction.receiverAcc.accountNumber = accountNumber;
    }
}


}
