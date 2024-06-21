
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserService } from '../../shared/services/user.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import {MatProgressBarModule} from '@angular/material/progress-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

  standalone: true, // Add this line
  imports: [CommonModule, FormsModule, MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressBarModule
    
    
  ]

})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
 
  successMessage: string = ''; 

  constructor(private userService: UserService, private router:Router) {}

  public isLoading: boolean = false;

async onSubmit(): Promise<void> {
  this.errorMessage = '';
  this.successMessage = '';

  try {
    this.isLoading = true;
    const loginResponse = await this.userService.login(this.username, this.password);
    this.isLoading = false;


    if (loginResponse.success) {
      this.successMessage = 'Login successful! Please wait. Redirecting to dashboard..........';

      
      
      const company_name=loginResponse.userDetails?.company_name;
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2000);
    } else {
      this.errorMessage = loginResponse.message || 'Unknown error occurred';
    }
  } catch (error) {
    console.error('Login error:', error);
    this.errorMessage = 'An error occurred during login. Please try again later.';
  }
}
navigateToSignup() {
  console.log('Navigating to signup');
  this.router.navigate(['/signup']);
}
}
