import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatMenuModule,
  ],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
})
export class ItemsComponent {
  selectedSection: string = 'products';
  selectedProduct: any = null;
  products = [
    { name: 'Product 1', quantity: 10, price: 100 },
    { name: 'Product 2', quantity: 5, price: 50 },
    { name: 'Product 3', quantity: 20, price: 200 },
  ];
  transactions = [
    { type: 'Sale', name: 'Product 1', date: '2024-01-01', quantity: 2, price: 200 },
    { type: 'Purchase', name: 'Product 2', date: '2024-01-02', quantity: 10, price: 500 },
  ];
  displayedColumns: string[] = ['type', 'name', 'date', 'quantity', 'price'];

  showSection(section: string) {
    this.selectedSection = section;
  }

  editProduct(product: any) {
    this.selectedProduct = product;
  }

  deleteProduct(product: any) {
    this.products = this.products.filter(p => p !== product);
    if (this.selectedProduct === product) {
      this.selectedProduct = null;
    }
  }

  adjustItem(product: any) {
    // Adjust item logic here
  }
}