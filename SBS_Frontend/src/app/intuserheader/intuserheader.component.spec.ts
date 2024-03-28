import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntuserheaderComponent } from './intuserheader.component';

describe('IntuserheaderComponent', () => {
  let component: IntuserheaderComponent;
  let fixture: ComponentFixture<IntuserheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntuserheaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IntuserheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
