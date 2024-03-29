import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { TransactionListModule } from './transaction-list.module';
import { IntheaderComponent } from '../../shared/intheader/intheader.component';
@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
  transactions = [
    { id: 1, description: 'Transaction 1', amount: '$100' },
    { id: 2, description: 'Transaction 2', amount: '$200' },
    // Add more transactions as needed
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToAction(action: string, id: number): void {
    this.router.navigate(['/transaction', action, id]);
  }
}
