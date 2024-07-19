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
  selector: 'app-add-salespersons',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
  MatButtonModule,
MatInputModule],
  templateUrl: './add-salespersons.component.html',
  styleUrl: './add-salespersons.component.scss'
})
export class AddSalespersonsComponent {
  name: string = '';
  // phone: string = '';
  email: string = '';
  // address: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router,    private dialogRef: MatDialogRef<AddSalespersonsComponent>
  ) { }
  

  

  async onSubmit() {
    const user_id = localStorage.getItem('userId');

    if (user_id === null) {
        this.errorMessage = 'User not logged in.';
        return;
    }  
    const result = await this.userService.addSalesperson(this.name,this.email,  user_id);

    if (result.success) {
        this.successMessage = 'Sales person added successfully!';
        this.dialogRef.close({ success: true, person: result.person });
    } else {
        this.errorMessage = result.message;
    }
}


  onCancel(): void {
    this.dialogRef.close({ success: false });
  }
  

}