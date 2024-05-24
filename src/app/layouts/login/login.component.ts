// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { UserService } from '../../shared/services/user.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export class LoginComponent {
//   username: string = '';
//   password: string = '';
//   errorMessage: string = '';

//   constructor(private userService: UserService) {}

// //   async onSubmit(): Promise<void> {
// //     let response = await this.userService.login(this.username, this.password);

// //     if (response.success) {
// //       console.log('Login successful:', response);
// //       this.errorMessage = ''; // Clear any previous error message
// //       // Navigate to another page or perform any other logic upon successful login
// //     } else {
// //       console.error('Login failed:', response.message);
// //       this.errorMessage = response.message || 'Login failed. Please try again.';
// //     }
// //   }
// // }
// async onSubmit(): Promise<void> {
//   this.errorMessage = '';
//   this.successMessage = '';

//   try {
//     const result = await this.userService.login(this.username, this.password);

//     if (result.success) {
//       this.successMessage = 'Login successful!';
//       // Navigate to another page or perform other logic upon successful login
//     } else {
//       this.errorMessage = result.message || 'Login failed. Please try again.';
//     }
//   } catch (error) {
//     console.error('Error during login:', error);
//     this.errorMessage = 'An error occurred during login. Please try again later.';
//   }
// }
// }
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  successMessage: string = ''; // Ensure this line is present

  constructor(private userService: UserService) {}

//   async onSubmit(): Promise<void> {
//     this.errorMessage = '';
//     this.successMessage = ''; // Ensure this line is present

//     try {
//       const result = await this.userService.login(this.username, this.password);

//       if (result.success) {
//         this.successMessage = 'Login successful!';
//         // Navigate to another page or perform other logic upon successful login
//       } else {
//         this.errorMessage = result.message || 'Login failed. Please try again.';
//       }
//     } catch (error) {
//       console.error('Error during login:', error);
//       this.errorMessage = 'An error occurred during login. Please try again later.';
//     }
//   }
// }
async onSubmit(): Promise<void> {
  this.errorMessage = '';
  this.successMessage = '';

  try {
    const loginResponse = await this.userService.login(this.username, this.password);

    if (loginResponse.success) {
      this.successMessage = 'Login successful!';
      // Handle other actions after successful login, such as navigating to another page
    } else {
      this.errorMessage = loginResponse.message || 'Unknown error occurred';
    }
  } catch (error) {
    console.error('Login error:', error);
    this.errorMessage = 'An error occurred during login. Please try again later.';
  }
}
}
