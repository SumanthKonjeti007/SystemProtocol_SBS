import { TestBed } from '@angular/core/testing';

import { ProfileRequestsService } from './profile-requests.service';

describe('ProfileRequestsService', () => {
  let service: ProfileRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
