import { Component, OnInit } from '@angular/core';
import { ProfileRequestsService } from '../../services/profile-requests.service';
import { JwtHelperService } from '../../services/jwt-helper.service'; 
import { UserRoles } from '../../user-roles';

@Component({
  selector: 'app-int-update-profile',
  templateUrl: './int-update-profile.component.html',
  styleUrls: ['./int-update-profile.component.css']
})
export class IntUpdateProfileComponent implements OnInit {
  token: string | undefined;
  decodedToken: any | null;
  constructor(private profileRequestsService: ProfileRequestsService, private jwtHelper: JwtHelperService) {}
  profileRequestsList: any[] | undefined;

  ngOnInit(): void {
    if (this.jwtHelper.checkSessionValidity(UserRoles.internal)){
    this.token = localStorage.getItem('jwtToken') || '{}';
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    this.fetchProfileRequests();
  }
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
  toggleDetails(request: any): void {
    request.showDetails = !request.showDetails;
  }
  
  approveRequest(requestId: number): void {
    const request = this.profileRequestsList?.find(req => req.id === requestId);
    console.log(request);
    if (!request) {
      console.error('Request not found:', requestId);
      return;
    }
  
    const approveData = {
      id: requestId,
      user: {
        userId: request.user.id,
      },
      approver: {
        userId: this.decodedToken.userId // Assuming 6 is the ID of the approving user
      },
      updateData: request.updateData,
      approvalStatus: "APPROVED"
    };
    console.log(approveData);
    this.profileRequestsService.updateUserProfile(approveData).subscribe(
      () => {
        console.log('Profile request approved successfully');
        // Optional: Refresh the list of pending requests
        this.fetchProfileRequests();
      },
      (error: any) => {
        console.error('Failed to approve profile request:', error);
      }
    );
  }
  

  rejectRequest(requestId: number): void {
    const request = this.profileRequestsList?.find(req => req.id === requestId);
    if (!request) {
      console.error('Request not found:', requestId);
      return;
    }
  
    const approveData = {
      id: requestId,
      user: {
        userId: request.user.id,
      },
      approver: {
        userId: this.decodedToken.userId // Assuming 6 is the ID of the approving user
      },
      updateData: request.updateData,
      approvalStatus: "REJECTED"
    };
  
    this.profileRequestsService.updateUserProfile(approveData).subscribe(
      () => {
        console.log('Profile request approved successfully');
        // Optional: Refresh the list of pending requests
        this.fetchProfileRequests();
      },
      (error: any) => {
        console.error('Failed to approve profile request:', error);
      }
    );
  }
}
