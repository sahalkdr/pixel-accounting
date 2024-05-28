import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Item {
  code: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  discount: number;
  tax: number;
  total: number;
}

@Component({
  selector: 'app-quickbilling',
  templateUrl: './quickbilling.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./quickbilling.component.scss']
})
export class QuickbillingComponent implements OnInit {
  items: Item[] = [
    { code: '', name: '', quantity: 0, unit: '', price: 0, discount: 0, tax: 0, total: 0 }
  ];

  customerDetails: any = null; // Define the structure for customer details
  paymentMode: string = 'Cash';
  amountReceived: number = 0;

  ngOnInit(): void {
    // Initialization logic here
    this.loadItems();
  }

  calculateItemTotal(item: Item): number {
    const subtotal = item.quantity * item.price;
    const discountAmount = (item.discount / 100) * subtotal;
    const taxAmount = (item.tax / 100) * (subtotal - discountAmount);
    return subtotal - discountAmount + taxAmount;
  }

  loadItems(): void {
    // Placeholder for loading items, replace with actual data fetching logic
    this.items = [
      {
        code: 'ITEM001',
        name: 'Sample Item 1',
        quantity: 10,
        unit: 'pcs',
        price: 100,
        discount: 10,
        tax: 5,
        total: 95
      },
      {
        code: 'ITEM002',
        name: 'Sample Item 2',
        quantity: 5,
        unit: 'pcs',
        price: 200,
        discount: 20,
        tax: 10,
        total: 190
      }
    ];
  }

  searchCustomer(event: any): void {
    // Logic for searching customer
    console.log('Searching customer...');
    // Mock data for customer details
    this.customerDetails = {
      name: 'John Doe',
      phone: '123-456-7890',
      email: 'john.doe@example.com'
    };
  }

  changeQuantity(): void {
    // Logic for changing item quantity
    console.log('Changing quantity...');
  }

  removeItem(): void {
    // Logic for removing item
    console.log('Removing item...');
  }

  calculateSubtotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + item.total, 0);
  }

  calculateChange(): number {
    return this.amountReceived - this.calculateTotal();
  }
}