import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) { }

  // public userDetails: { username: string, password: string, token: string } = { username: "", password: "", token: "" };

  // async login(username: string, password: string) {
  //   const payload = { username, password };

  //   try {
  //     const loginResponse = await this.apiService.httpRequest({
  //       method: 'POST',
  //       url: 'http://localhost/restaurant/login.php',  // Adjust the URL to point to your actual backend
  //       data: payload
  //     });

  //     if (loginResponse.success) {
  //       this.userDetails = {
  //         username: loginResponse.username,
  //         password, // For demonstration purposes only. Never store plain passwords.
  //         token: loginResponse.token
  //       };
  //       return { success: true, userDetails: this.userDetails };
  //     } else {
  //       return { success: false, message: loginResponse.error };
  //     }
  //   } catch (error) {
  //     console.error('Login error:', error);
  //     return { success: false, message: 'An error occurred during login. Please try again later.' };
  //   }
  public userDetails: { username: string, password: string, token: string } = { username: "", password: "", token: "" };

  // async login(username: string, password: string) {
  //   const payload = { username, password };

  //   try {
  //     const loginResponse = await this.apiService.httpRequest({
  //       method: 'POST',
  //       url: 'http://localhost/restaurant/login.php',  // Adjust the URL to point to your actual backend
  //       data: payload
  //     });

  //     if (loginResponse.success) {
  //       this.userDetails = {
  //         username: loginResponse.username,
  //         password, // For demonstration purposes only. Never store plain passwords.
  //         token: loginResponse.token
  //       };
  //       return { success: true, userDetails: this.userDetails };
  //     } else {
  //       return { success: false, message: loginResponse.error };
  //     }
  //   } catch (error) {
  //     console.error('Login error:', error);
  //     return { success: false, message: 'An error occurred during login. Please try again later.' };
  //   }
  // }

  // async login(username: string, password: string) {
  //   const payload = { username, password };

  //   try {
  //     const loginResponse = await this.apiService.httpRequest({
  //       method: 'POST',
  //       url: 'http://localhost/restaurant/login.php',  // Adjust the URL to point to your actual backend
  //       data: payload
  //     });

  //     if (loginResponse.success && loginResponse.username) {
  //       this.userDetails = {
  //         username: loginResponse.username,
  //         password, // For demonstration purposes only. Never store plain passwords.
  //         token: loginResponse.token
  //       };
  //       return { success: true, userDetails: this.userDetails };
  //     } else {
  //       return { success: false, message: loginResponse.error };
  //     }
  //   } catch (error) {
  //     console.error('Login error:', error);
  //     return { success: false, message: 'An error occurred during login. Please try again later.' };
  //   }
  // }
  async login(username: string, password: string) {
    const payload = { username, password };

    try {
      const loginResponse = await this.apiService.httpRequest({
        method: 'POST',
        url: 'http://localhost/restaurant/login.php',  // Adjust the URL to point to your actual backend
        data: payload
      });

      if (loginResponse.success) {
        this.userDetails = {
          username: loginResponse.username,
          password, // For demonstration purposes only. Never store plain passwords.
          token: loginResponse.token
        };
        return { success: true, userDetails: this.userDetails };
      } else {
        return { success: false, message: loginResponse.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login. Please try again later.' };
    }
  }


  // async signup(username: string, email: string, password: string, phone: string) {
  //   const payload = { username, email, password, phone };

  //   try {
  //     const signupResponse = await this.apiService.httpRequest({
  //       method: 'POST',
  //       url: 'http://localhost/restaurant/signup.php',  // Adjust the URL to point to your actual backend
  //       data: payload
  //     });

  //     if (signupResponse.success) {
  //       return { success: true, message: signupResponse.success };
  //     } else {
  //       return { success: false, message: signupResponse.error };
  //     }
  //   } catch (error) {
  //     console.error('Signup error:', error);
  //     return { success: false, message: 'An error occurred during signup. Please try again later.' };
  //   }
  async signup(username: string, email: string, password: string, phone: string) {
    const payload = { username, email, password, phone };

    try {
      console.log('Sending signup payload:', payload);

      const signupResponse = await this.apiService.httpRequest({
        method: 'POST',
        url: 'http://localhost/restaurant/signup.php',  // Adjust the URL to point to your actual backend
        data: payload
      });

      console.log('Signup response:', signupResponse);

      if (signupResponse.success) {
        return { success: true, message: signupResponse.success };
      } else {
        return { success: false, message: signupResponse.error };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'An error occurred during signup. Please try again later.' };
    }

  }
}