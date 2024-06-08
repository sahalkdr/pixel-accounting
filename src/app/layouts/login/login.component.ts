
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router} from '@angular/router';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

  standalone: true, // Add this line
  imports: [CommonModule, FormsModule]

})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
 
  successMessage: string = ''; 

  constructor(private userService: UserService, private router:Router) {}


async onSubmit(): Promise<void> {
  this.errorMessage = '';
  this.successMessage = '';

  try {
    const loginResponse = await this.userService.login(this.username, this.password);


    if (loginResponse.success) {
      this.successMessage = 'Login successful!';
      
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
}
