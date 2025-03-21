import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTrainRecordComponent } from './delete-train-record.component';

describe('DeleteTrainRecordComponent', () => {
  let component: DeleteTrainRecordComponent;
  let fixture: ComponentFixture<DeleteTrainRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteTrainRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteTrainRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
