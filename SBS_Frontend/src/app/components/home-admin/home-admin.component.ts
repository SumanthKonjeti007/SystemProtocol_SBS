import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '../../services/jwt-helper.service';
import { UserRoles } from '../../user-roles';
@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css'
})
export class HomeAdminComponent {
  constructor(private jwtHelper: JwtHelperService, private router: Router) {}
  ngOnInit(): void {
    this.jwtHelper.checkSessionValidity(UserRoles.admin);
  }
}
