import { transaction } from './../services/transaction';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditService } from '../edit.service'; // Adjust import


@Component({
  selector: 'app-edit-transaction',
  templateUrl: './edit-transaction.component.html',
  styleUrls: ['./edit-transaction.component.css']
})
export class EditTransactionComponent implements OnInit {
  transactionId!: number;
  transaction!: transaction;

  constructor(private route: ActivatedRoute, private editService: EditService) { }

  ngOnInit(): void {
      this.transaction = history.state.transaction;
      console.log(this.transaction)
      
  }


  saveChanges(): void {
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
  }
}
