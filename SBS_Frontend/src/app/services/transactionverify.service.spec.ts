import { TestBed } from '@angular/core/testing';

import { TransactionverifyService } from './transactionverify.service';

describe('TransactionverifyService', () => {
  let service: TransactionverifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionverifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
