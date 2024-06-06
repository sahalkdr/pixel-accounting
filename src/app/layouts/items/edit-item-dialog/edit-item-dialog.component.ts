import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-edit-item-dialog',
  
  templateUrl: './edit-item-dialog.component.html',
  styleUrls: ['./edit-item-dialog.component.scss']
})
export class EditItemDialogComponent {
  editForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.editForm = this.fb.group({
      name: [data.item.name],
      sale_price: [data.item.sale_price],
      stock: [data.item.stock]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const updatedItem = this.editForm.value;
    const id = this.data.item.id;

    this.userService.updateItem(id, updatedItem).then(response => {
      if (response.success) {
        this.dialogRef.close(updatedItem);
      } else {
        console.error('Error updating item:', response.message);
      }
    });
  }
}
