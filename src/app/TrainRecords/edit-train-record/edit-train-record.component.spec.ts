import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTrainRecordComponent } from './edit-train-record.component';

describe('EditTrainRecordComponent', () => {
  let component: EditTrainRecordComponent;
  let fixture: ComponentFixture<EditTrainRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTrainRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTrainRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
