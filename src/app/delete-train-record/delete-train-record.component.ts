import { Component,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-train-record',
  imports: [],
  templateUrl: './delete-train-record.component.html',
  styleUrl: './delete-train-record.component.scss'
})
export class DeleteTrainRecordComponent {
  recordId: string;

  constructor(
    public dialogRef: MatDialogRef<DeleteTrainRecordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { recordId: string }
  ) {
    this.recordId = data.recordId;
  }

  // Close the dialog and return 'false' (cancel)
  onCancel(): void {
    this.dialogRef.close(false);
  }

  // Close the dialog and return 'true' (confirm deletion)
  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
