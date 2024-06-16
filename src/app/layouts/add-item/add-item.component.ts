import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { AddCategoryDialogComponent } from '../items/add-category-dialog/add-category-dialog.component';


@Component({
  selector: 'app-additem',
  standalone: true,
  imports: [CommonModule,FormsModule,MatButtonModule,MatDialogModule,MatIconModule,MatInputModule,MatSelectModule,MatCheckboxModule],
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

  constructor(private userService: UserService, private router: Router,private dialog: MatDialog) { }
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

  
  openAddCategoryDialog(): void {
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
        width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result && result.id) {
            this.categories.push(result); 
            this.newItem.category_id = result.id;  //auto selct new categoty
            this.newItem.tax_rate = result.tax_rate;
        }
    });
}


  onCategoryChange(event: any) {
    const selectedCategory = this.categories.find(category => category.id === event.value);
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