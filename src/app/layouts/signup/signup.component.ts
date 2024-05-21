// 

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  phone: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  onSubmit() {
    // For now, we just reset the messages
    this.errorMessage = 'This is a mock error message.';
    this.successMessage = 'This is a mock success message.';
  }
}