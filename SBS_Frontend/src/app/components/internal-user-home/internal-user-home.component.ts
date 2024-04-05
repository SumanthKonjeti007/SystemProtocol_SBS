import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Router } from '@angular/router';
import { JwtHelperService } from '../../services/jwt-helper.service';
import { UserRoles } from '../../user-roles';
@Component({
  selector: 'app-internal-user-home',
  templateUrl: './internal-user-home.component.html',
  styleUrls: ['./internal-user-home.component.css']
})
export class InternalUserHomeComponent {

  constructor(private jwtHelper: JwtHelperService, private router: Router) {}
ngOnInit(): void {
  this.jwtHelper.checkSessionValidity(UserRoles.internal);
}
}
