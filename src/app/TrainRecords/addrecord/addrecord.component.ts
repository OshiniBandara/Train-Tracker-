import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-addrecord',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    ReactiveFormsModule,
    // Required for reactive forms
  ],
  templateUrl: './addrecord.component.html',
  styleUrl: './addrecord.component.scss'
})
export class AddTrainRecordComponent {
  form !: FormGroup;
  actionBtn: string = "Save"

  constructor(private fb: FormBuilder,
    private api: ApiService,
    private dialogRef: MatDialogRef<AddTrainRecordComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any) {

    // Initialize the form
    this.form = this.fb.group({
      Date: ['', Validators.required],
      TrainName: ['', Validators.required],
      FromDestination: ['', Validators.required],
      ToDestination: ['', Validators.required],
      ScheduledTime: ['', Validators.required],
      DelayTime: ['', Validators.required],
    });

    if (this.editData) {
      this.actionBtn = "Update";
      this.form.controls['Date'].setValue(this.editData.Date);
      this.form.controls['TrainName'].setValue(this.editData.TrainName);
      this.form.controls['FromDestination'].setValue(this.editData.FromDestination);
      this.form.controls['ToDestination'].setValue(this.editData.ToDestination);
      this.form.controls['DcheduledTime'].setValue(this.editData.ScheduledTime);
      this.form.controls['DelayTime'].setValue(this.editData.DelayTime);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;

      // Convert 24-hour time to 12-hour format with AM/PM
      formData.ScheduledTime = this.convertTo12HourFormat(formData.ScheduledTime);
      formData.DelayTime = this.convertTo12HourFormat(formData.DelayTime);

      if (this.editData) {
        this.updateRecord();
      } else {
        this.api.postTrainRecord(formData)
          .subscribe({
            next: (res) => {
              alert("Train Record Added Successfully!");
              this.form.reset();
              this.dialogRef.close('Recorded');
            },
            error: () => {
              alert("Error While Adding the Train Record!");
            }
          });
      }
    } else {
      alert("Form is invalid. Please check the fields.");
    }
  }


  // Handle cancel button click
  onCancel() {
    console.log('Form cancelled');
    // You can add logic to close the dialog or navigate away
  }

  updateRecord() {
    this.api.putTrainRecord(this.form.value, this.editData.id)
      .subscribe({
        next: (res) => {
          alert("Record Updated Successfully!");
          this.form.reset();
          this.dialogRef.close('Updated');
        },
        error: () => {
          alert("Error While Updating the Record!");
        }
      })
  }

  // Function to convert 24-hour time to 12-hour time with AM/PM
  convertTo12HourFormat(time: string): string {
    const [hours, minutes] = time.split(':');
    const hours12 = parseInt(hours, 10) % 12 || 12;
    const suffix = parseInt(hours, 10) < 12 ? 'AM' : 'PM';
    const hours12WithLeadingZero = hours12 < 10 ? `0${hours12}` : `${hours12}`;

    return `${hours12WithLeadingZero}:${minutes} ${suffix}`;
  }
}