import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
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
  actionBtn : string = "Save"

  constructor(private fb: FormBuilder, 
              private api : ApiService,
              private dialogRef: MatDialogRef<AddTrainRecordComponent>,
              @Inject(MAT_DIALOG_DATA) public editData : any) {
    // Initialize the form
    this.form = this.fb.group({
      date: ['', Validators.required],
      trainName: ['', Validators.required],
      fromDestination: ['', Validators.required],
      toDestination: ['', Validators.required],
      scheduledTime: ['', Validators.required],
      delayTime: ['', Validators.required],
    });
    if(this.editData){
      this.actionBtn = "Update";
      this.form.controls['date'].setValue(this.editData.date);
      this.form.controls['trainName'].setValue(this.editData.trainName);
      this.form.controls['fromDestination'].setValue(this.editData.fromDestination);
      this.form.controls['toDestination'].setValue(this.editData.toDestination);
      this.form.controls['scheduledTime'].setValue(this.editData.scheduledTime);
      this.form.controls['delayTime'].setValue(this.editData.delayTime);
    }
  }

  
  // Handle form submission
  onSubmit() {
    if(!this.editData){
      if (this.form.valid) {
      
        this.api.postTrainRecord(this.form.value)
        .subscribe({
          next:(res)=>{
            alert("Train Record Added Successfully!")
            this.form.reset();
            this.dialogRef.close('Recorded');
          },
            error:()=>{
              alert("Error While Adding the Train Record!") 
            }
        })
      } else {
        this.updateRecord()
      }
    }
  }
// Handle cancel button click
  onCancel() {
  console.log('Form cancelled');
  // You can add logic to close the dialog or navigate away
  }

  updateRecord(){
    this.api.putTrainRecord(this.form.value,this.editData.id)
    .subscribe({
      next:(res) => {
        alert("Record Updated Successfully!");
        this.form.reset();
        this.dialogRef.close('Updated');
      },
      error:()=>{
        alert("Error While Updating the Record!");
      }
    })
  }
}