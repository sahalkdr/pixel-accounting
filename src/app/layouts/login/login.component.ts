import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {UserService} from "../../shared/services/user.service";

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

  constructor(private userService: UserService){}

  async onSubmit(): Promise<void> {


    let userDetails = await this.userService.login(this.username, this.password);

    debugger;
    // For now, we just prevent the form from submitting and show a placeholder message
    this.errorMessage = 'Login functionality is not implemented yet.';
  }
}