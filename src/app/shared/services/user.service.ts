import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService,private http: HttpClient) { }

  
 
  public userDetails: { username: string, password: string, token: string } = { username: "", password: "", token: "" };

  fetchParties(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost/restaurant/get-parties.php');
  }
  
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

  async addParty(name: string, phone: string, email: string, address: string) {
    const payload = { name, phone, email, address };

    try {
      console.log('Sending add party payload:', payload);

      const addPartyResponse = await this.apiService.httpRequest({
        method: 'POST',
        url: 'http://localhost/restaurant/add-parties.php',  // Adjust the URL to point to your actual backend
        data: payload
      });

      console.log('Add party response:', addPartyResponse);

      if (addPartyResponse.success) {
        return { success: true, message: addPartyResponse.success };
      } else {
        return { success: false, message: addPartyResponse.error };
      }
    } catch (error) {
      console.error('Add party error:', error);
      return { success: false, message: 'An error occurred while adding the party. Please try again later.' };
    }
  }

  async addItem(name: string, category: string, salePrice: number, itemCode?: string, imageUrl?: string) {
    const payload = { name, category, sale_price: salePrice, item_code: itemCode, image_url: imageUrl };

    try {
      console.log('Sending add item payload:', payload);

      const addItemResponse = await this.apiService.httpRequest({
        method: 'POST',
        url: 'http://localhost/restaurant/items.php',  // Adjust the URL to point to your actual backend
        data: payload
      });

      console.log('Add item response:', addItemResponse);

      if (addItemResponse.success) {
        return { success: true, message: addItemResponse.success };
      } else {
        return { success: false, message: addItemResponse.error };
      }
    } catch (error) {
      console.error('Add item error:', error);
      return { success: false, message: 'An error occurred while adding the item. Please try again later.' };
    }
  }

  

  
}