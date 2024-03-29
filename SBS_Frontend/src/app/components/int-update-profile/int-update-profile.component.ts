import { Component, OnInit } from '@angular/core';
import { ProfileRequestsService } from '../../services/profile-requests.service';

@Component({
  selector: 'app-int-update-profile',
  templateUrl: './int-update-profile.component.html',
  styleUrls: ['./int-update-profile.component.css']
})
export class IntUpdateProfileComponent implements OnInit {
  constructor(private profileRequestsService: ProfileRequestsService) {}
  profileRequestsList: any[] | undefined;

  ngOnInit(): void {
    this.fetchProfileRequests();
  }

  fetchProfileRequests(): void {
    this.profileRequestsService.getPendingProfileRequests().subscribe(
      (data: any[]) => {
        this.profileRequestsList = data;
        console.log(this.profileRequestsList);
      },
      (error: any) => {
        console.error('Failed to fetch profile requests:', error);
      }
    );
  }

  getRequestedValue(updateData: string, key: string): string {
    if (updateData) {
      const updateObj = JSON.parse(updateData);
      return updateObj[key];
    }
    return '';
  }

  approveRequest(requestId: number): void {
    // Implement approval logic here
  }

  rejectRequest(requestId: number): void {
    // Implement rejection logic here
  }
}
