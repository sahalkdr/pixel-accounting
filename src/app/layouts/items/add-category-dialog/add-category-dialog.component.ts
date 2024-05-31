import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../shared/services/user.service';


@Component({
  selector: 'app-add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  styleUrls: ['./add-category-dialog.component.scss']
})
export class AddCategoryDialogComponent {
  addCategoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService
  ) {
    this.addCategoryForm = this.fb.group({
      name: ['', Validators.required],
      tax_rate: ['', Validators.required]
    });
  }

  

  onCancel(): void {
    this.dialogRef.close();
  }


  onSubmit():void {
    if (this.addCategoryForm.valid) {
      const newCategory = this.addCategoryForm.value;
      this.userService.addCategory(newCategory).then(response => {
        if (response.success) {
          this.dialogRef.close(newCategory);
        } else {
          console.error('Error adding category:', response.message);
        }
      });
  }
}

}