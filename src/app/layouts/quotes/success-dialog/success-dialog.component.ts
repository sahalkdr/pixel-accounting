import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quote-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.scss']
})
export class SuccessDialogComponent {
  quoteId: number; 

  constructor(
    private dialogRef: MatDialogRef<SuccessDialogComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject MAT_DIALOG_DATA to receive data
  ) {
    console.log("success quote id",data.quoteId);
    this.quoteId = data.quoteId; 
  }

  navigate() {
    this.router.navigate(['/quote-details'], { queryParams: { quote_id: this.quoteId } });
    this.dialogRef.close();
  }
}
