import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.css'
})
export class HeaderAdminComponent {
  [x: string]: any;
  activeRoute!: string;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.activeRoute = event.urlAfterRedirects;
      });
  }
  isActiveRoute(route: string): boolean {
    return this.activeRoute === route;
  }

  navigateTo(route: string) {
    this['router'].navigate([route]);
  }
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