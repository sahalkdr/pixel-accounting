import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';



@Component({
  selector: 'app-addparty',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
  MatButtonModule,
MatInputModule],
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
    const user_id = localStorage.getItem('userId');

    if (user_id === null) {
        this.errorMessage = 'User not logged in.';
        return;
    }  
    const result = await this.userService.addParty(this.name, this.phone, this.email, this.address, user_id);

    if (result.success) {
        this.successMessage = 'Party added successfully!';
        this.dialogRef.close({ success: true, party: result.party });
    } else {
        this.errorMessage = result.message;
    }
}


  onCancel(): void {
    this.dialogRef.close({ success: false });
  }
  

}