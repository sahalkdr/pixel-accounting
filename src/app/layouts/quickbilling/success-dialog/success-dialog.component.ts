import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.scss']
})
export class SuccessDialogComponent {
  billId: number; 

  constructor(
    private dialogRef: MatDialogRef<SuccessDialogComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject MAT_DIALOG_DATA to receive data
  ) {
    this.billId = data.billId; 
  }

  navigate() {
    this.router.navigate(['/bill-details'], { queryParams: { bill_id: this.billId } });
    this.dialogRef.close();
  }
}
