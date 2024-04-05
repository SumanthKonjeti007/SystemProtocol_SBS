import { Component } from '@angular/core';
import { JwtHelperService } from '../../services/jwt-helper.service'; 
import { Router } from '@angular/router';
import { UserRoles } from '../../user-roles';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private jwtHelper: JwtHelperService, private router: Router) {}

  ngOnInit(): void {
    this.jwtHelper.checkSessionValidity(UserRoles.customer);

}
}