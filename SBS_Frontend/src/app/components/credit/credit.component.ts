import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CreditService } from '../../services/credit.service';
import { transaction } from '../../services/transaction';
import { account } from '../../services/account';
import { user } from "../../services/user"
import { UserService } from '../../services/user.service';
import { JwtHelperService } from '../../services/jwt-helper.service'; 
import { UserRoles } from '../../user-roles';
import { RegisterService } from '../../services/register.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

function isTransactionType(type: string): type is 'CREDIT' | 'DEBIT' {
  return type === 'CREDIT' || type === 'DEBIT';
}

@Component({
  selector: 'app-credit',
  templateUrl: './credit.component.html',
  styleUrls: ['./credit.component.css']
})
export class CreditComponent implements OnInit{
  @ViewChild('otpDialog') otpDialog!: TemplateRef<any>;
  
  senderAcc = new account();
  receiverAcc = new account();
  user = new user();
  transaction = new transaction(this.user);
  userId: number | null = null;
  token = localStorage.getItem('jwtToken') || '{}';
  decodedToken = this.jwtHelper.decodeToken(this.token);
  dialogRef!: MatDialogRef<any>;
  otp: string = '';
  
  constructor(private creditService: CreditService,
    private userService: UserService,
    private jwtHelper: JwtHelperService,
    private registerService: RegisterService,
    private dialog: MatDialog) {}

  ngOnInit(): void {
    if (this.jwtHelper.checkSessionValidity(UserRoles.customer)){
      if (this.token) {
        const userId = this.decodedToken?.userId;
        if (userId) {
          this.initializeTransaction(userId);
        } else {
          console.error('User ID is not present in the decoded token');
        }
      } else {
        console.error('JWT Token not found in local storage');
      }
    }
  }

  initializeTransaction(userId: number): void {
    this.user.userId = userId;
    this.transaction = new transaction(this.user);
  }

  generateOtp() {
    this.registerService.generateOtp(this.decodedToken.email).subscribe(
      (response: any) => {
        console.log('OTP generation response:', response);
        this.dialogRef = this.dialog.open(this.otpDialog);
      },
      (error: any) => {
        console.error('OTP generation error:', error);
        alert("Error generating OTP.");
      }
    );
  }

  validateOTP() {
    const dataToSend =  {...this.transaction};
    console.log(dataToSend)
    this.registerService.validateOtp(this.decodedToken.email, this.otp).subscribe(
      (response: any) => {
        console.log('OTP validation response:', response);
        alert('OTP is valid!');
        this.dialogRef.close();
        console.log(dataToSend)
        this.makeTransaction(dataToSend);
      },
      (error: any) => {
        console.error('OTP validation error:', error);
        alert("INVALID OTP, request not created");
        this.dialogRef.close();
      }
    );
  }  

  submitTransaction(form: NgForm) {
    if (form.valid) {
      this.generateOtp(); // Call generateOtp() to initiate OTP generation
    }
    
  }

  makeTransaction(form: any){
    const upperCaseType = form.transactionType.toUpperCase();
      this.senderAcc.accountNumber = form.senderAcc;
      this.transaction.senderAcc = this.senderAcc;
      this.receiverAcc.accountNumber = form.receiverAcc;
      this.transaction.receiverAcc = this.receiverAcc;

      this.transaction.transactionType = form.transactionType;
      this.transaction.amount = form.amount;
      console.log(this.transaction);

    if (isTransactionType(upperCaseType)) {
      console.log(this.transaction);
      this.creditService.performTransaction(upperCaseType, this.transaction)
        .subscribe({
          next: (response: any) => {
            //console.log('Transaction successful', response);
            console.log('Response from backend:', response);
            if (typeof response === 'string' && response.endsWith('created successfully')) {
              //console.log('User signed up successfully!');
              alert('Request created successfully!');
            }
            else{
              console.error('Unexpected response from backend:', response);
              alert('Unexpected response from backend');
            }
            // Handle successful transaction here (e.g., display a success message)
          },
          error: (error) => {
            console.error('Transaction failed', error);
            // Handle transaction failure here (e.g., display an error message)
          }
        });
    } else {
      console.error('Invalid transaction type');
      // Handle invalid transaction type here
    }
  }
}
