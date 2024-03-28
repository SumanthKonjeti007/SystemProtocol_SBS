import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService for showing success message

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
  transactions: any[] = [];
  isLoading: boolean = false; // Variable to track loading state

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService // ToastrService for showing success message
  ) { }

  ngOnInit(): void {
    // Fetch transactions from your Spring Boot API
    this.http.get<any[]>('http://localhost:8080/api/v1/transaction/allTransactions').subscribe(
      (data: any[]) => {
        console.log(data);
        this.transactions = data;
      },
      (error) => {
        console.error('Error fetching transactions:', error);
      }
    );
  }

  goToAction(action: string, id: number): void {
    this.router.navigate(['/transaction', action, id]);
  }

  verifyTransaction(transactionId: number): void {
    // Set loading state to true
    this.isLoading = true;

    // Perform the verification logic here
    console.log(`Verifying transaction with ID ${transactionId}`);
    // Make HTTP request to approve the transaction
    this.http.post<any>('http://localhost:8080/api/v1/transaction/approveRequest', {
      authorizationId: transactionId,
      user: {
        username: "hkonjeti" // Replace with actual username or retrieve from authentication
      }
    }).subscribe(
      (response) => {
        console.log('Transaction approved successfully:', response);
        // Show success message using ToastrService
        this.toastr.success('Verification successful!', 'Success');
      },
      (error) => {
        console.error('Error approving transaction:', error);
        // Show error message using ToastrService
        this.toastr.error('Verification failed! Please try again later.', 'Error');
      }
    ).add(() => {
      // Set loading state to false when HTTP request is completed
      this.isLoading = false;
    });
  }

  rejectTransaction(transactionId: number): void {
    // Perform the rejection logic here
    console.log(`Rejecting transaction with ID ${transactionId}`);
    // Make HTTP request to reject the transaction
    this.http.post<any>('http://localhost:8080/api/v1/transaction/rejectRequest', {
      authorizationId: transactionId,
      user: {
        username: "doe" // Replace with actual username or retrieve from authentication
      }
    }).subscribe(
      (response) => {
        console.log('Transaction rejected successfully:', response);
        // Optionally, you can update the UI or perform additional actions upon successful rejection
      },
      (error) => {
        console.error('Error rejecting transaction:', error);
        // Handle error, display error message, etc.
      }
    );
  }
}
