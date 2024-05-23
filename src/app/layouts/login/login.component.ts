import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService) {}

  async onSubmit(): Promise<void> {
    let response = await this.userService.login(this.username, this.password);

    if (response.success) {
      console.log('Login successful:', response);
      this.errorMessage = ''; // Clear any previous error message
      // Navigate to another page or perform any other logic upon successful login
    } else {
      console.error('Login failed:', response.message);
      this.errorMessage = response.message || 'Login failed. Please try again.';
    }
  }
}
