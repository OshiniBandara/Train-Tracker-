import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelayreportComponent } from './delayreport.component';

describe('DelayreportComponent', () => {
  let component: DelayreportComponent;
  let fixture: ComponentFixture<DelayreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelayreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelayreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
