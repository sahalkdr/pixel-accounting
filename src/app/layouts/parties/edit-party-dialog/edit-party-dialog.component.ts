


import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup,ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-edit-party-dialog',
  standalone:true,
  imports:[MatCardModule,MatFormFieldModule,MatInputModule,MatButtonModule,ReactiveFormsModule],
  templateUrl: './edit-party-dialog.component.html',
  styleUrls: ['./edit-party-dialog.component.scss']
})
export class EditPartyDialogComponent {
  editForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditPartyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.editForm = this.fb.group({
      name: [data.party.name],
      phone: [data.party.phone],
      email: [data.party.email],
      address: [data.party.address],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const updatedParty = this.editForm.value;
    const id = this.data.party.id;

    this.userService.updateParty(id, updatedParty).then(response => {
      if (response.success) {
        this.data.party.name = updatedParty.name;
        this.data.party.email = updatedParty.email;
        this.data.party.phone = updatedParty.phone;
        this.data.party.address = updatedParty.address;
        this.dialogRef.close(updatedParty);
      } else {
        console.error('Error updating party:', response.message);
      }
    });
  }
}

