import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'


@Component({
  selector: 'app-edit-train-record',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-train-record.component.html',
  styleUrl: './edit-train-record.component.scss'
})
export class EditTrainRecordComponent {
  editForm !: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditTrainRecordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editForm = this.fb.group({
      Date: [this.convertToDate(data.Date), Validators.required],
      TrainName: [data.TrainName, Validators.required],
      FromDestination: [data.FromDestination, Validators.required],
      ToDestination: [data.ToDestination, Validators.required],
      ScheduledTime: [this.convertTo24HourFormat(data.ScheduledTime), Validators.required],
      DelayTime: [this.convertTo24HourFormat(data.DelayTime), Validators.required]
    });
  }

  onSubmit() {
    debugger;
    if (this.editForm.valid) {

      const formData = this.editForm.value;

      const trainId = this.data.TrainId

      formData.ScheduledTime = this.convertTo12HourFormat(formData.ScheduledTime);
      formData.DelayTime = this.convertTo12HourFormat(formData.DelayTime);

      this.apiService.putTrainRecord(trainId, formData).subscribe({
        next: (response) => {
          this.snackBar.open(response?.message || 'Train record updated successfully!', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBar.open(error?.error?.error || 'Failed to update record.', 'Close', { duration: 3000 });
        }
      });
    }
  }

  // Handle cancel action
  onCancel() {
    this.dialogRef.close(false);
  }

  // Function to convert 24-hour time to 12-hour time with AM/PM
  convertTo12HourFormat(time: string): string {
    const [hours, minutes] = time.split(':');
    const hours12 = parseInt(hours, 10) % 12 || 12;
    const suffix = parseInt(hours, 10) < 12 ? 'AM' : 'PM';
    const hours12WithLeadingZero = hours12 < 10 ? `0${hours12}` : `${hours12}`;

    return `${hours12WithLeadingZero}:${minutes} ${suffix}`;
  }

  // Function to convert 12-hour time (AM/PM) to 24-hour time format
  convertTo24HourFormat(time: string): string {
    const [timePart, suffix] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (suffix === 'PM' && hours !== 12) hours += 12;
    if (suffix === 'AM' && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }


  // Function to convert date string in MM/DD/YYYY format to a Date object
  convertToDate(dateStr: string): Date | null {
    if (!dateStr) return null;
  
    // Parse the date string to create a Date object
    const date = new Date(dateStr);
  
    // If the date is invalid, log an error and return null
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateStr);
      return null;
    }
  
    console.log('Converted Date:', date); // Log the converted Date for debugging
    return date;
  }

}