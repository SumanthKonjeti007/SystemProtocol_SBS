import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntTransactionsComponent } from './int-transactions.component';

describe('IntTransactionsComponent', () => {
  let component: IntTransactionsComponent;
  let fixture: ComponentFixture<IntTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntTransactionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IntTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
