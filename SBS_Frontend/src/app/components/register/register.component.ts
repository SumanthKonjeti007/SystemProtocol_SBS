import { RegisterService } from './../../services/register.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../shared/password-match.directive';
import { user } from '../../services/user';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '../../services/jwt-helper.service';
import { UserRoles } from '../../user-roles';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  userRoles = UserRoles;
  fromAdmin: boolean = false
  roleId= UserRoles.customer ;
  
  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    accountType: ['', Validators.required],
    emailAddress: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required]
  }, {
    validators: passwordMatchValidator
  });

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private route: ActivatedRoute,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private formBuilder: FormBuilder
  ) {
    if (this.route.snapshot.queryParamMap.has('fromAdmin')) {
      this.fromAdmin = this.route.snapshot.queryParamMap.get('fromAdmin') === 'true';
    this.roleId = UserRoles.internal;
    this.jwtHelper.checkSessionValidity(UserRoles.admin);
  }
}
ngOnInit(): void {
  // Initialization logic can go here if needed
}


  get firstName() {
    return this.registerForm.controls['firstName'];
  }

  get lastName() {
    return this.registerForm.controls['lastName'];
  }

  get username() {
    return this.registerForm.controls['username'];
  }

  get password() {
    return this.registerForm.controls['password'];
  }

  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }

  get phoneNumber() {
    return this.registerForm.controls['phoneNumber'];
  }

  get email() {
    return this.registerForm.controls['emailAddress'];
  }

  get address() {
    return this.registerForm.controls['address'];
  }

  get accountType() {
    return this.registerForm.controls['accountType'];
  }

  signup(formData: any) {
     formData = this.registerForm.value;
     console.log(formData)
      if(formData.accountType == 'merchant'){
        this.roleId = UserRoles.merchant
      }
      if(formData.accountType == 'customer'){
        this.roleId = UserRoles.customer
      }
    const newUser: user = {
      username: formData.username,
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      passwordHash: formData.password,
      emailAddress: formData.emailAddress,
      phoneNumber: formData.phoneNumber,
      status: 'Active',
      userId: undefined,
      role: {
        roleId: this.roleId,
        roleName: undefined
      },
      token: undefined
    };
  
    // this.registerService.register(newUser)
    // .subscribe(
    //   (response: any) => {
    //     console.log('Response from backend:', response);
    //     if (typeof response === 'string' && response.startsWith('User created/updated successfully')) {
    //       console.log('User signed up successfully!');
    //       alert('User signed up successfully!');
    //       // Redirect to the dashboard page
    //       this.router.navigate(['/login']);
    //     } else {
    //       console.error('Unexpected response from backend:', response);
    //       alert('Unexpected response from backend');
    //     }
    //   },
    //   (error: any) => {
    //     console.error('Error signing up:', error);
    //     // Handle error, e.g., display error message
    //     alert('Error signing up: ' + error.message);
    //   }
    // );
    console.log(newUser);
    this.registerService.register(newUser)
  .subscribe(
    (response: any) => {
      console.log('Response from backend:', response);
      if (typeof response === 'string' && response.startsWith('Customer Registered successfully.')) {
        console.log('User signed up successfully!');
        alert('User signed up successfully!');
        // Redirect to the dashboard page
        this.router.navigate(['/login']);
      } 
      else if(typeof response === 'string' && response.startsWith('User created/Updated successfully.')){
        console.log('Internal user created successfully!');
        alert('Internal user created successfully!');
        // Redirect to the dashboard page
      }
      else {
        console.error('Unexpected response from backend:', response);
        alert('Unexpected response from backend');
      }
    },
    (error: any) => {
      console.error('Error signing up:', error);
      // Handle error, e.g., display error message
      alert('Error signing up: ' + error.message);
    }
  );

}
getUserRole(): number {
  const token = localStorage.getItem('jwtToken') || '{}';
  const decodedToken = this.jwtHelper.decodeToken(token);
  if (decodedToken && decodedToken.role) {
    return decodedToken.role;
  } else {
    return 0; // or any default role you prefer
  }
}
  
  
}