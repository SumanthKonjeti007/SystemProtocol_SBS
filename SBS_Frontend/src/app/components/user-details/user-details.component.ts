
// user-details.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserDetailsService } from '../../services/user-details.service';
import { interval, Observable, Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { JwtHelperService } from '../../services/jwt-helper.service';
import { UserRoles } from '../../user-roles';
//import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  users: any[] = [];
  private unsubscribe$: Subject<void> = new Subject<void>();
  token = localStorage.getItem('jwtToken')|| '{}';
  decodedToken = this.jwtHelper.decodeToken(this.token);

  constructor(private userService: UserDetailsService, private jwtHelper: JwtHelperService) { }

  ngOnInit(): void {
    if (this.jwtHelper.checkSessionValidity(UserRoles.admin)){
    // Fetch user details initially
    this.fetchUserDetails();

    // Fetch user details every 10 seconds (adjust the interval as needed)
    interval(10)
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(() => this.fetchUserDetails())
      )
      .subscribe(
        (data: any[]) => {
          this.users = data;
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
  }
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private fetchUserDetails(): Observable<any[]> {
    return this.userService.getUserDetails();
  }
}

