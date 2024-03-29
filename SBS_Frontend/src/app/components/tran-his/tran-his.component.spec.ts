import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranHisComponent } from './tran-his.component';
import { TransactionService } from './transaction.service';
import { of } from 'rxjs';

describe('TranHisComponent', () => {
  let component: TranHisComponent;
  let fixture: ComponentFixture<TranHisComponent>;
  let transactionService: TransactionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranHisComponent ],
      imports: [ HttpClientTestingModule ],
      providers: [ TransactionService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranHisComponent);
    component = fixture.componentInstance;
    transactionService = TestBed.inject(TransactionService);

    spyOn(transactionService, 'getAllTransactions').and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllTransactions on init', () => {
    expect(transactionService.getAllTransactions).toHaveBeenCalledWith(component.userId);
  });
});
