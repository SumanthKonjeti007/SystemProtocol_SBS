import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { decodeToken } from '../../util/jwt-helper';
import { TransactionverifyService } from '../../services/transactionverify.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
})
export class TransactionListComponent implements OnInit {
  transactions: any[] = [];
  isLoading: boolean = false; // Track loading state
  token: string | undefined;
  decodedToken: any | null;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private transactionverifyService: TransactionverifyService 
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('jwtToken') || '{}';
    this.decodedToken = decodeToken(this.token);
    this.fetchTransactions(); // Fetch transactions on init
  }

  fetchTransactions(): void {
    this.isLoading = true;
    this.transactionverifyService.fetchTransactions().subscribe(
      (data) => {
        this.transactions = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching transactions:', error);
        this.toastr.error('Failed to fetch transactions.', 'Error');
        this.isLoading = false;
      }
    );
  }

  verifyTransaction(tId: number): void {
    this.isLoading = true; 
    const username = this.decodedToken?.username; 
    if (username) {
      this.transactionverifyService.verifyTransaction(tId, username).subscribe(
        (response) => {
          this.toastr.success('Verification successful!', 'Success');
          // Optionally refresh transaction list or update UI state here
        },
        (error) => {
          this.toastr.error('Verification failed! Please try again later.', 'Error');
        }
      ).add(() => this.isLoading = false); // Reset loading state
    } else {
      this.toastr.error('Username not found.', 'Error');
      this.isLoading = false; // Reset loading state if username is not found
    }
  }

  rejectTransaction(transactionId: number): void {
    this.isLoading = true; // Indicate loading state
    const username = this.decodedToken?.username; // Ensure safety with optional chaining
    if (username) {
      this.transactionverifyService.rejectTransaction(transactionId, username).subscribe(
        (response) => {
          this.toastr.success('Transaction rejected successfully.', 'Success');
          // Optionally refresh transaction list or update UI state here
        },
        (error) => {
          this.toastr.error('Rejection failed! Please try again later.', 'Error');
        }
      ).add(() => this.isLoading = false); // Reset loading state
    } else {
      this.toastr.error('Username not found.', 'Error');
      this.isLoading = false; // Reset loading state if username is not found
    }
  }
}
