import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-train-record',
  imports: [],
  templateUrl: './delete-train-record.component.html',
  styleUrl: './delete-train-record.component.scss'
})
export class DeleteTrainRecordComponent {

  constructor(public dialogRef: MatDialogRef<DeleteTrainRecordComponent>) {}

  // Close the dialog and return 'false' (cancel)
  onCancel(): void {
    this.dialogRef.close(false);
  }

  // Close the dialog and return 'true' (confirm deletion)
  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
