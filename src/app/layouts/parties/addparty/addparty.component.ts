import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { MatDialogRef } from '@angular/material/dialog';




@Component({
  selector: 'app-addparty',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './addparty.component.html',
  styleUrl: './addparty.component.scss'
})
export class AddpartyComponent {
  name: string = '';
  phone: string = '';
  email: string = '';
  address: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router,    private dialogRef: MatDialogRef<AddpartyComponent>
  ) { }
  

  

  async onSubmit() {
    const result = await this.userService.addParty(this.name, this.phone, this.email, this.address);

    if (result.success) {
      this.successMessage = 'Party added successfully!';
      
      this.dialogRef.close({ success: true, party: { name: this.name, phone: this.phone, email: this.email, address: this.address } });
    } else {
      this.errorMessage = result.message;
    }
  }

  onCancel(): void {
    this.dialogRef.close({ success: false });
  }
  

}