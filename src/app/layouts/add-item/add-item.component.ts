import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-additem',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.scss'
})
export class AdditemComponent implements OnInit{

  newItem = {
    name: '',
    category_id: 0,
    sale_price: 0,
    stock: 0,
    unit: '',
    discount: 0
  };
  categories: { id: number, name: string }[] = [];

  constructor(private userService: UserService, private router: Router) { }
  ngOnInit() {
    this.loadCategories(); // Load categories when the component initializes
  }

  async loadCategories() {
    try {
      // Fetch categories from your UserService or API
      const response = await this.userService.fetchCategories(); // Assuming you have a method for fetching categories
      if (response.success) {
        this.categories = response.categories;
      } else {
        console.error('Failed to fetch categories:', response.message);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  
  async addItem() {
    const result = await this.userService.addItem(this.newItem);

    if (result.success) {
      alert('Item added successfully');
      setTimeout(() => {
        this.router.navigate(['/dashboard/items']);
      }, 2000);
      // Reset form or navigate away
    } else {
      alert('Failed to add item: ' + result.message);
    }
  }

  // onSubmit() {
  //   // Add your logic to handle the form submission
  //   console.log('Item added:', {
  //     itemName: this.itemName,
  //     itemHSN: this.itemHSN,
  //     category: this.category,
  //     salePrice: this.salePrice,
  //     purchasePrice: this.purchasePrice,
  //     taxRate: this.taxRate
  //   });
  //   // You might want to call a service to save the item to the server
  // }

  // selectUnit() {
  //   // Logic to select unit
  // }

  // assignCode() {
  //   // Logic to assign code
  // }

  // addItemImage() {
  //   // Logic to add item image
  // }

  // showPricing() {
  //   this.showPricingSection = true;
  // }

  // showStock() {
  //   this.showPricingSection = false;
  // }

  // addWholesalePrice() {
  //   // Logic to add wholesale price
  // }

}