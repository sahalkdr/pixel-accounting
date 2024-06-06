import { Injectable } from '@angular/core';
import { ApiService } from './api.service';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) { }

  
 
  public userDetails: { username: string, password: string, token: string } = { username: "", password: "", token: "" };

  
  
  async login(username: string, password: string) {
    const payload = { username, password };

    try {
      const loginResponse = await this.apiService.httpRequest({
        method: 'POST',
        url: 'http://localhost/restaurant/login.php', 
        data: payload
      });

      if (loginResponse.success) {
        this.userDetails = {
          username: loginResponse.username,
          password, 
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
        url: 'http://localhost/restaurant/signup.php',  
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
        url: 'http://localhost/restaurant/add-parties.php',  
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

  async addCategory(category:{name: string, tax_rate: number}) {
    const payload = { name:category.name, tax_rate :category.tax_rate};

    try {
      console.log('Sending add category payload:', payload);

      const addCategoryResponse = await this.apiService.httpRequest({
        method: 'POST',
        url: 'http://localhost/restaurant/add-categories.php',  
        data: payload
      });

      console.log('Add party response:', addCategoryResponse);

      if (addCategoryResponse.success) {
        return { success: true, message: addCategoryResponse.success };
      } else {
        return { success: false, message: addCategoryResponse.error };
      }
    } catch (error) {
      console.error('Add party error:', error);
      return { success: false, message: 'An error occurred while adding the party. Please try again later.' };
    }
  }

 

  
  

  async updateItem(id: number, updatedItem: any) {
    const payload = { id, ...updatedItem }; 

    try {
      console.log('Sending update item payload:', payload);

      const updateItemResponse = await this.apiService.httpRequest({
        method: 'POST',
        url: 'http://localhost/restaurant/update_item.php', 
        data: payload
      });

      console.log('Update item response:', updateItemResponse);

      if (updateItemResponse.success) {
        return { success: true, message: updateItemResponse.success };
      } else {
        return { success: false, message: updateItemResponse.error };
      }
    } catch (error) {
      console.error('Update item error:', error);
      return { success: false, message: 'An error occurred while updating the item. Please try again later.' };
    }
  }

  async updateCategory(id: number, updatedItem: any) {
    const payload = { id, ...updatedItem }; // Merge the ID into the payload

    try {
      console.log('Sending update category payload:', payload);

      const updateCategoryResponse = await this.apiService.httpRequest({
        method: 'POST',
        url: 'http://localhost/restaurant/update_categories.php', 
        data: payload
      });

      console.log('Update category response:', updateCategoryResponse);

      if (updateCategoryResponse.success) {
        return { success: true, message: updateCategoryResponse.success };
      } else {
        return { success: false, message: updateCategoryResponse.error };
      }
    } catch (error) {
      console.error('Update item error:', error);
      return { success: false, message: 'An error occurred while updating the item. Please try again later.' };
    }
  }

  async updateParty(id: number, updatedParty: any) {
    const payload = { id, ...updatedParty }; // Merge the ID into the payload

    try {
      console.log('Sending update party payload:', payload);

      const updatePartyResponse = await this.apiService.httpRequest({
        method: 'POST',
        url: 'http://localhost/restaurant/edit_party.php', 
        data: payload
      });

      console.log('Update party response:', updatePartyResponse);

      if (updatePartyResponse.success) {
        return { success: true, message: updatePartyResponse.success };
      } else {
        return { success: false, message: updatePartyResponse.error };
      }
    } catch (error) {
      console.error('Update party error:', error);
      return { success: false, message: 'An error occurred while updating the party. Please try again later.' };
    }
  }
  async addItem(item: { name: string, category_id: number, sale_price: number, stock: number, unit: string, discount: number }) {
    try {
      const addItemResponse = await this.apiService.httpRequest({
        method: 'POST',
        url: 'http://localhost/restaurant/add_item.php',  
        data: item
      });

      if (addItemResponse.success) {
        return { success: true, message: addItemResponse.message };
      } else {
        return { success: false, message: addItemResponse.message };
      }
    } catch (error) {
      console.error('Add item error:', error);
      return { success: false, message: 'An error occurred while adding the item. Please try again later.' };
    }
  }

  async fetchCategories() {
    try {
      const categoriesResponse = await this.apiService.httpRequest({
        method: 'GET',
        url: 'http://localhost/restaurant/get_categories.php' 
      });
  
      if (categoriesResponse.success) {
        return { success: true, categories: categoriesResponse.categories };
      } else {
        return { success: false, message: categoriesResponse.error };
      }
    } catch (error) {
      console.error('Fetch categories error:', error);
      return { success: false, message: 'An error occurred while fetching categories. Please try again later.' };
    }
  }
  
  async saveBill(bill: any) {
    try {
      const response = await this.apiService.httpRequest({
        method: 'POST',
        url: 'http://localhost/restaurant/add_bill.php',
        data: bill
      });

      return response.success ? { success: true, billId: response.bill_id } : { success: false, message: response.error };
    } catch (error) {
      console.error('Save bill error:', error);
      return { success: false, message: 'An error occurred while saving the bill. Please try again later.' };
    }
  }

  async saveBillItems(billId: number, items: { Id: number, quantity: number }[]) {
    const payload = { bill_id: billId, items };
  
    try {
      const saveBillItemsResponse = await this.apiService.httpRequest({
        method: 'POST',
        url: 'http://localhost/restaurant/saveBillItems.php',
        data: payload
      });
  
      if (saveBillItemsResponse.success) {
        return { success: true };
      } else {
        console.error('Save bill items error:', saveBillItemsResponse.error);
        return { success: false, message: saveBillItemsResponse.error || 'Error saving items' };
      }
    } catch (error) {
      console.error('Save bill items error:', error);
      return { success: false, message: 'An error occurred while saving the bill items. Please try again later.' };
    }
  }
  


  async deleteItem(id: number) {
    const payload = { id };

    try {
      const deleteItemResponse = await this.apiService.httpRequest({
        method: 'POST',
        url: 'http://localhost/restaurant/delete_item.php', 
        data: payload
      });

      if (deleteItemResponse.success) {
        return { success: true, message: deleteItemResponse.message };
      } else {
        return { success: false, message: deleteItemResponse.error };
      }
    } catch (error) {
      console.error('Delete item error:', error);
      return { success: false, message: 'An error occurred while deleting the item. Please try again later.' };
    }
  }

  async deleteParty(id: number) {
    try {
      const deleteResponse = await this.apiService.httpRequest({
        method: 'POST',
        url: 'http://localhost/restaurant/delete_party.php',
        data: { id }
      });

      if (deleteResponse.success) {
        return { success: true, message: deleteResponse.message };
      } else {
        return { success: false, message: deleteResponse.message };
      }
    } catch (error) {
      console.error('Delete party error:', error);
      return { success: false, message: 'An error occurred while deleting the party. Please try again later.' };
    }
  }

  

  
}