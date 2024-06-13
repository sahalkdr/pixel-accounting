



import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule,MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  phone: string = '';
  company_name: string='';
  location: string='';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private userService: UserService, private router:Router) { }

  async onSubmit(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    const result = await this.userService.signup(this.username, this.email, this.password, this.phone, this.company_name, this.location);

    if (result.success) {
      this.successMessage = 'Signup successful!';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } else {
      this.errorMessage = result.message;
    }
  }
}
