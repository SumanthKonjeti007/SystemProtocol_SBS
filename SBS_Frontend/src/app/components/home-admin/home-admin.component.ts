import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '../../services/jwt-helper.service';
import { UserRoles } from '../../user-roles';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css'] // It should be styleUrls instead of styleUrl
})
export class HomeAdminComponent {
  userRoles = UserRoles;
  constructor(private jwtHelper: JwtHelperService, private router: Router) {}
  ngOnInit(): void {
    this.jwtHelper.checkSessionValidity(UserRoles.admin);
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
