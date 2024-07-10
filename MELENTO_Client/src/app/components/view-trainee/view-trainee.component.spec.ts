import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTraineeComponent } from './view-trainee.component';

describe('ViewTraineeComponent', () => {
  let component: ViewTraineeComponent;
  let fixture: ComponentFixture<ViewTraineeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewTraineeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTraineeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
