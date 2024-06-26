import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EditPartyDialogComponent } from './edit-party-dialog/edit-party-dialog.component';
import { PartiesComponent } from './parties.component';
import { MatCardModule } from '@angular/material/card';

import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
     
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    PartiesComponent
  ],
  exports: [
     
  ]
})
export class PartiesModule { }
