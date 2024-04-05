import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternalUserHomeComponent } from '../../components/internal-user-home/internal-user-home.component';
import { TransactionListComponent } from '../../components/transaction-list/transaction-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intheader',
  templateUrl: './intheader.component.html',
  styleUrl: './intheader.component.css'
})
export class IntheaderComponent {

  constructor(private router: Router) {}
  ngOnInit(): void {
    // Add click event listener to the logout link
    document.getElementById('logout')?.addEventListener('click', this.logout.bind(this));
  }

  logout(event: Event) {
    event.preventDefault(); // Prevent the default link behavior
    // Remove the JWT token from local storage
    localStorage.removeItem('jwtToken');
    // Redirect to the login page
    this.router.navigate(['/login']);
  }


}
