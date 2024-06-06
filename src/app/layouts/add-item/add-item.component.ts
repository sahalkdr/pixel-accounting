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
    discount: 0,
    has_tax:false,
    tax_rate:0
    
  };
  categories: { id: number, name: string,tax_rate:number }[] = [];

  constructor(private userService: UserService, private router: Router) { }
  ngOnInit() {
    this.loadCategories(); 
  }

  async loadCategories() {
    try {
      
      const response = await this.userService.fetchCategories(); 
      if (response.success) {
        this.categories = response.categories;
      } else {
        console.error('Failed to fetch categories:', response.message);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }
  onCategoryChange(event: any) {
    const selectedCategory = this.categories.find(category => category.id === +event.target.value);
    if (selectedCategory) {
      this.newItem.tax_rate = selectedCategory.tax_rate;
    }
  }

  
  async addItem() {
    if(!this.newItem.has_tax)
    {
      this.newItem.tax_rate=0;
    }

    const result = await this.userService.addItem(this.newItem);

    if (result.success) {
      alert('Item added successfully');
      setTimeout(() => {
        this.router.navigate(['/dashboard/items']);
      }, 2000);
      
    } else {
      alert('Failed to add item: ' + result.message);
    }
  }

  
  
  
}