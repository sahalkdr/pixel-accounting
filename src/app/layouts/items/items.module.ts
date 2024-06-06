import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EditItemDialogComponent } from './edit-item-dialog/edit-item-dialog.component';
import { EditCategoryDialogComponent } from './edit-category-dialog/edit-category-dialog.component';
import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component';
import { ItemsComponent } from './items.component';


@NgModule({
  declarations: [
    EditItemDialogComponent ,
    AddCategoryDialogComponent,
    EditCategoryDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    
    ItemsComponent
  ],
  exports: [
    EditItemDialogComponent,
    AddCategoryDialogComponent,
    EditCategoryDialogComponent 
  ]
})
export class ItemsModule { }
