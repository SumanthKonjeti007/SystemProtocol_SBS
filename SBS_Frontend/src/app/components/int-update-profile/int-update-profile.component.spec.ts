import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntUpdateProfileComponent } from './int-update-profile.component';

describe('IntUpdateProfileComponent', () => {
  let component: IntUpdateProfileComponent;
  let fixture: ComponentFixture<IntUpdateProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntUpdateProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IntUpdateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
