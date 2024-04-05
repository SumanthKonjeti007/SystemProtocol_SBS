// funds.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '../../services/jwt-helper.service';
import { UserRoles } from '../../user-roles';

@Component({
  selector: 'app-funds',
  templateUrl: './funds.component.html',
  styleUrls: ['./funds.component.css']
})
export class FundsComponent {
  constructor(private router: Router, private jwtHelper: JwtHelperService) {}

  ngOnInit(): void {
    if (this.jwtHelper.checkSessionValidity(UserRoles.customer)){
    }
  }

  performTransfer(selectedOption: string) {
    // Redirect to another component based on the selected option
    switch (selectedOption) {

      case 'within-bank':
        this.router.navigate(['/tf_within']); // Redirect to tf_within component
        break;
      case 'outside-bank':
        this.router.navigate(['/tf_outside']);
        break;
      default:
        // Handle other cases or show an error message
        console.error('Invalid option selected');
        break;
    }
  }
}

