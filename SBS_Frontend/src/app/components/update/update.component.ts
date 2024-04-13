import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service'; // Update with the correct path
import { ReactiveFormsModule } from '@angular/forms';
import { JwtHelperService } from '../../services/jwt-helper.service'; 
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { UserRoles } from '../../user-roles';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'app-update-component',
  templateUrl: './update.component.html'
  , 
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  @ViewChild('otpDialog') otpDialog!: TemplateRef<any>;
  updateForm!: FormGroup;
  userData: any;
  id: any;
  updatedData: any;
  token = localStorage.getItem('jwtToken')|| '{}';
  decodedToken = this.jwtHelper.decodeToken(this.token);
  showOTP: boolean = false;
  otp: string = '';
  dialogRef!: MatDialogRef<any>;

  constructor(private formBuilder: FormBuilder, private userService: UserService,private router: Router, private jwtHelper: JwtHelperService, private dialog: MatDialog, private registerService:RegisterService) {}

  ngOnInit() {
    if (this.jwtHelper.checkSessionValidity(UserRoles.customer)){
    this.userData = history.state.userData;
    this.initForm();
  }
  }

  initForm() {
    this.updateForm = this.formBuilder.group({
      firstName: [this.userData.firstName, Validators.required],
      lastName: [this.userData.lastName, Validators.required],
      email: [this.userData.emailAddress, [Validators.required, Validators.email]],
      address: [this.userData.address],
      phoneNumber: [this.userData.phoneNumber]
      
      // Add more form controls as needed
    });
  }

  onSubmit() {
    this.generateOtp();
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
    this.registerService.validateOtp(this.decodedToken.email, this.otp).subscribe(
      (response: any) => {
        console.log('OTP validation response:', response);
        alert('OTP is valid!');
        this.dialogRef.close();
        this.updateUserData();
      },
      (error: any) => {
        console.error('OTP validation error:', error);
        alert("INVALID OTP, request not created");
        this.dialogRef.close();
      }
    );
  }

  updateUserData() {
    this.updatedData = {
      userId: this.decodedToken.userId,
      firstName: this.updateForm.value.firstName,
      lastName: this.updateForm.value.lastName,
      emailAddress: this.updateForm.value.email,
      phoneNumber: this.updateForm.value.phoneNumber,
      address: this.updateForm.value.address,
      role: {
        roleId: this.decodedToken.role
      }
    };

    const userDetails: any = {
      user: {
        userId: this.decodedToken.userId
      },
      updateData: JSON.stringify(this.updatedData)
    };

    console.log("Updating user data:", userDetails);

    this.userService.updateUserData(userDetails).subscribe(
      () => {
        console.log('User data updated successfully');
        this.router.navigate(['/profile']);
      },
      (error) => {
        console.error('Failed to update user data:', error);
        alert('Failed to update user data. Please try again.');
      }
    );
  }
}



















//   onSubmit() {
//   if (generateOtp()){
//     this.dialogRef =this.dialog.open(this.otpDialog);
//     if (this.validateOTP() && this.updateForm.valid){
        
//          this.updatedData = {
//           userId: this.userData.userId,
//           firstName: this.updateForm.value.firstName,
//           lastName: this.updateForm.value.lastName,
//           emailAddress: this.updateForm.value.email,
//           address: this.updateForm.value.address,
//           phoneNumber: this.updateForm.value.phoneNumber,
//           role:{
//             roleId: this.decodedToken?.role
//           }
//           // Add more fields as needed
//         };
//         console.log(this.decodedToken);
//         const userDetails: any = {
//           user:{
//             userId: this.decodedToken?.userId 
//           },
//           updateData: JSON.stringify(this.updatedData)
  
//         };
//         console.log("in onsubmit")
//         console.log(userDetails)
      
//         this.userService.updateUserData(userDetails).subscribe(
//           () => {
//             console.log('User data updated successfully');
//             this.router.navigate(['/profile']);
//             // Optionally, you can navigate to another page or show a success message
//           },
//           (error) => {
//             console.error('Failed to update user data:', error);
//             alert('Failed to update user data. Please try again.');
//             // Optionally, you can handle the error in other ways, such as showing a different alert message or staying on the same page
//           }
//         );
        
      

//     }
//     else{
//       alert("Invalid OTP.")
//     }
//   }
//   else{
//     alert("error generating OTP.")
//   }
// }









 
    
//   validateOTP() {

//     this.registerService.validateOtp(this.decodedToken?.email, this.otp )
//       .subscribe(
//         (response: any) => {
//           console.log('OTP validation response:', response);
//           alert('OTP is valid!');
//           this.showOTP = false;
//           this.dialogRef.close();
//           this.onSubmit()
        
       
//         },
//         (error: any) => {
//           console.error('OTP validation error:', error);
//           alert("INVALID OTP, request not created");
//           this.dialogRef.close();
//           // Handle the error as needed
//         }
//       );
//   }
// }
