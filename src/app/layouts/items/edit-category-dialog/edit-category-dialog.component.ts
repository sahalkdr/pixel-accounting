import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-edit-category-dialog',
  templateUrl: './edit-category-dialog.component.html',
  styleUrls: ['./edit-category-dialog.component.scss']
})
export class EditCategoryDialogComponent {
  editCategoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<EditCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editCategoryForm = this.fb.group({
      name: [data.category.name, Validators.required],
      tax_rate: [data.category.tax_rate, Validators.required]
    });
  }
  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.editCategoryForm.valid) {
    const updatedCategory=this.editCategoryForm.value;
    const id = this.data.category.id;
    this.userService.updateCategory(id, updatedCategory).then(response => {
      if (response.success) {
        this.data.category.name = updatedCategory.name;
          this.data.category.tax_rate = updatedCategory.tax_rate;
              this.dialogRef.close(updatedCategory);
           }
           else {
                  console.error('Error updating category:', response.message);
                }
              });
              }
   
         }

        }

 

