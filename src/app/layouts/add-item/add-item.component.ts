import { Component } from '@angular/core';
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
export class AdditemComponent {

  itemName: string = '';
  itemHSN: string = '';
  category: string = '';
  salePrice: number = 0;
  stock: number = 0;
  purchasePrice: number = 0;
  taxRate: number = 0;
  showPricingSection: boolean = true;
  successMessage:string='';
  errorMessage:string='';

  constructor(private userService: UserService, private router: Router) { }

  async onSubmit() {
    const result = await this.userService.addItem(this.itemName, this.category, this.salePrice, this.itemHSN);

    if (result.success) {
      this.successMessage = 'Item added successfully!';
      // Navigate to another page or reset form
      this.router.navigate(['/items']);  // Example: Navigate to items list
    } else {
      this.errorMessage = result.message;
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

  selectUnit() {
    // Logic to select unit
  }

  assignCode() {
    // Logic to assign code
  }

  addItemImage() {
    // Logic to add item image
  }

  showPricing() {
    this.showPricingSection = true;
  }

  showStock() {
    this.showPricingSection = false;
  }

  addWholesalePrice() {
    // Logic to add wholesale price
  }

}