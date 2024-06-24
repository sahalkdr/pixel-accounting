import { Injectable } from '@angular/core';
import { ApiService } from './api.service';




@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) { }

  
  async deleteCategory(id: number) {
    try {
      const deleteCategoryResponse = await this.apiService.httpRequest({
        method: 'POST',
        url: 'http://localhost/restaurant/delete_category.php',
        data: { id }
      });
  
      console.log('Delete Category Response:', deleteCategoryResponse); 
  
      if (deleteCategoryResponse.success) {
        return { success: true, message: deleteCategoryResponse.message };
      } else {
        return { success: false, message: deleteCategoryResponse.message };
      }
    } catch (error) {
      console.error('Delete category error:', error);
      return { success: false, message: 'An error occurred while deleting the category. Please try again later.' };
    }
  }

  async verifyToken(token: string) {
    try {
      const verifyTokenResponse = await this.apiService.httpRequest({
        method: 'POST',
        url: 'http://localhost/restaurant/verify_token.php',
        data: { token }
      });

      if (verifyTokenResponse.success) {
        return true; // Token is valid
      } else {
        return false; // Token is invalid
      }
    } catch (error) {
      console.error('Token verification error:', error);
      return false; // Error occurred during token verification
    }
  }


  public userDetails: { user_id: string | number,username: string, password: string, token: string,company_name:string,location:string,phone:string } = { user_id:"",username: "", password: "", token: "",company_name:"",location:"",phone:"" };


  
  async login(username: string, password: string) {
    const payload = { username, password };

    try {
      const loginResponse = await this.apiService.httpRequest({
        method: 'POST',
        url: 'http://localhost/restaurant/login.php', 
        data: payload
      });
      console.log('Login Response:', loginResponse);
      if (loginResponse.success) {
        const userId = parseInt(loginResponse.user_id, 10);
        this.userDetails = {
          user_id:userId,
          username: loginResponse.username,
          company_name:loginResponse.company_name,
          location:loginResponse.location,
          phone:loginResponse.phone,
          password, 
          token: loginResponse.token
        };
        localStorage.setItem('userId', userId.toString()); 
        localStorage.setItem('angular17token', this.userDetails.token);
        localStorage.setItem('companyName', loginResponse.company_name); 
        localStorage.setItem('location', loginResponse.location);
        localStorage.setItem('phone', loginResponse.phone);

        return { success: true, userDetails: this.userDetails };
      } else {
        return { success: false, message: loginResponse.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login. Please try again later.' };
    }
  }

  getUserDetails() {
    return this.userDetails;
  
  }

  
  async signup(username: string, email: string, password: string, phone: string, company_name:string,location:string) {
    const payload = { username, email, password, phone,company_name,location };

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

  async addParty(name: string, phone: string, email: string, address: string, user_id: string | number) {
    const payload = { name, phone, email, address, user_id };

    try {
        console.log('Sending add party payload:', payload);

        const addPartyResponse = await this.apiService.httpRequest({
            method: 'POST',
            url: 'http://localhost/restaurant/add-parties.php',
            data: payload
        });

        console.log('Add party response:', addPartyResponse);

        if (addPartyResponse.success) {
            return {
                success: true,
                party: {
                    id: addPartyResponse.party_id,
                    name,
                    phone,
                    email,
                    address
                }
            };
        } else {
            return { success: false, message: addPartyResponse.error };
        }
    } catch (error) {
        console.error('Add party error:', error);
        return { success: false, message: 'An error occurred while adding the party. Please try again later.' };
    }
}

  

  async addCategory(category: { name: string, tax_rate: number },user_id: string | number) {
    const payload = { name: category.name, tax_rate: category.tax_rate,user_id };

    try {
        console.log('Sending add category payload:', payload);

        const addCategoryResponse = await this.apiService.httpRequest({
            method: 'POST',
            url: 'http://localhost/restaurant/add-categories.php',
            data: payload
        });

        console.log('Add category response:', addCategoryResponse);

        if (addCategoryResponse.success) {
            return { success: true, category: addCategoryResponse.category };
        } else {
            return { success: false, message: addCategoryResponse.error };
        }
    } catch (error) {
        console.error('Add category error:', error);
        return { success: false, message: 'An error occurred while adding the category. Please try again later.' };
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
    const payload = { id, ...updatedParty }; 

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
  async addItem(item: { name: string, category_id: number, sale_price: number, stock: number, unit: string, discount: number,user_id: string | number }) {
    
    try {
      const addItemResponse = await this.apiService.httpRequest({
        method: 'POST',
        url: 'http://localhost/restaurant/add_item.php',  
        data: item
      });

      if (addItemResponse.success) {
        return { success: true, message: addItemResponse.message, item: {
          id: addItemResponse.item.id,
                    name: addItemResponse.item.name,
                    category_id: addItemResponse.item.category_id,
                    sale_price: addItemResponse.item.sale_price,
                    stock: addItemResponse.item.stock,
                    unit: addItemResponse.item.unit,
                    discount: addItemResponse.item.discount,
                    has_tax: addItemResponse.item.has_tax,
                    tax_rate: addItemResponse.item.tax_rate,
                    user_id: addItemResponse.item.user_id
      } };
      } else {
        return { success: false, message: addItemResponse.message };
      }
    } catch (error) {
      console.error('Add item error:', error);
      return { success: false, message: 'An error occurred while adding the item. Please try again later.' };
    }
  }

  async fetchCategories() {
    const userId = localStorage.getItem('userId');
    try {
      const categoriesResponse = await this.apiService.httpRequest({
        method: 'GET',
        url: `http://localhost/restaurant/get_categories.php?user_id=${userId}`
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
  
  async saveBillWithItems(bill: any, items: { Id: number, quantity: number }[]) {
    try {
      // Save the bill first
      const billResponse = await this.apiService.httpRequest({
        method: 'POST',
        url: 'http://localhost/restaurant/add_bill.php',
        data: bill
      });
  
      if (!billResponse.success) {
        return { success: false, message: billResponse.error || 'Error saving bill' };
        console.error('messag:', billResponse.error);

      }
  
      // If the bill is saved successfully, save the bill items
      const billId = billResponse.bill_id;
      const itemsPayload = { bill_id: billId, items };
  
      const itemsResponse = await this.apiService.httpRequest({
        method: 'POST',
        url: 'http://localhost/restaurant/saveBillItems.php',
        data: itemsPayload
      });
  
      if (!itemsResponse.success) {
        return { success: false, message: itemsResponse.message || 'Error saving bill items' };
        console.log('message:',itemsResponse.message);
      }
  
      // If both the bill and items are saved successfully
      return { success: true, billId ,message:"Bill sabed successfully"};
    } catch (error) {
      console.error('Save bill with items error:', error);
      return { success: false, message: 'An error occurred while saving the bill and items. Please try again later.' };
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
    const payload = { id };
    try {
      const deleteResponse = await this.apiService.httpRequest({
        method: 'POST',
        url: 'http://localhost/restaurant/delete_party.php',
        data: payload
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