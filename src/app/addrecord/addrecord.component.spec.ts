import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrainRecordComponent } from './addrecord.component';

describe('AddrecordComponent', () => {
  let component: AddTrainRecordComponent;
  let fixture: ComponentFixture<AddTrainRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTrainRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTrainRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
