import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';




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

  constructor(private userService: UserService, private router: Router) { }
  

  // async onSubmit(): Promise<void> {
  //   this.errorMessage = '';
  //   this.successMessage = '';

  //   const result = await this.userService.signup(this.username, this.email, this.password, this.phone);

  //   if (result.success) {
  //     this.successMessage = 'Signup successful!';
  //     setTimeout(() => {
  //       this.router.navigate(['/login']);
  //     }, 2000);
  //   } else {
  //     this.errorMessage = result.message;
  //   }
  // }

  async onSubmit() {
    const result = await this.userService.addParty(this.name, this.phone, this.email, this.address);

    if (result.success) {
      this.successMessage = 'Party added successfully!';
      // Navigate to another page or reset form
      this.router.navigate(['/parties']);  // Example: Navigate to parties list
    } else {
      this.errorMessage = result.message;
    }
  }
  

}