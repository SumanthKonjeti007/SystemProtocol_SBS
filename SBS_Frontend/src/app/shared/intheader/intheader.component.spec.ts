import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntheaderComponent } from './intheader.component';

describe('IntheaderComponent', () => {
  let component: IntheaderComponent;
  let fixture: ComponentFixture<IntheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntheaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IntheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
