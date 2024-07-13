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
      purchase_price: [data.item.purchase_price],
      stock: [data.item.stock],
      unit: [data.item.unit],
      discount: [data.item.discount],
      tax_rate: [data.item.tax_rate]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    
    const updatedItem=this.editForm.value;
    const id = this.data.item.id;
    this.userService.updateItem(id, updatedItem).then(response => {
      if (response.success) {
        this.data.item.name = updatedItem.name;
        this.data.item.stock = updatedItem.stock;
        this.data.item.sale_price = updatedItem.sale_price;
        this.data.item.purchase_price = updatedItem.purchase_price;
          this.data.item.tax_rate = updatedItem.tax_rate;
          this.data.item.discount = updatedItem.discount;
          this.data.item.unit = updatedItem.unit;

              this.dialogRef.close(updatedItem);
           }
           else {
                  console.error('Error updating category:', response.message);
                }
              });
              
   
         }

}
