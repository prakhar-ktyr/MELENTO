import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateReportsComponent } from './update-reports.component';

describe('UpdateReportsComponent', () => {
  let component: UpdateReportsComponent;
  let fixture: ComponentFixture<UpdateReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
