import { Component,OnInit } from '@angular/core';
import { OnSameUrlNavigation,Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder,FormGroup,ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { FormsModule } from '@angular/forms'; //
import { MatDialog } from '@angular/material/dialog';
import { EditItemDialogComponent } from './edit-item-dialog/edit-item-dialog.component'; // Import your new dialog component
import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component';
import { EditCategoryDialogComponent } from './edit-category-dialog/edit-category-dialog.component';
import { ConfirmDialogComponent } from '../../layouts/confirm-dialog/confirm-dialog.component';



@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    FormsModule,
  ],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
})
export class ItemsComponent implements OnInit{
  public products: any[] = [];
  public filteredProducts: any[] = [];
  public categories: any[] = [];
  public filteredCategories: any[] = [];

  selectedSection: string = 'products';
  selectedProduct: any = null;
  // isEditMode: boolean = false;
  editForm: FormGroup;
  

  
  constructor(private router: Router,private userService: UserService,private http: HttpClient,private fb: FormBuilder,public dialog: MatDialog) {
    this.editForm = this.fb.group({
      name: [''],
      sale_price: [''],
      stock: [''],

    });
   }
  ngOnInit(): void {
    this.fetchproducts();
    this.fetchcategories();
  }

  showSection(section: string) {
    this.selectedSection = section;
    this.selectedProduct = null;
    // this.isEditMode = false
  }

  navigateToAddItem() {
    this.router.navigate(['/item/add']);
  }
  navigateToAddCategories()
  {
    this.router.navigate(['/category/add']);
  }

  editProduct(product: any) {
    this.selectedProduct = product;
    
    // this.isEditMode = false;
  }
  public fetchproducts()
  {
    this.http.get('http://localhost/restaurant/get-items.php').subscribe(
      (resp:any) => {
        console.log(resp);
        this.products=resp;
        this.filteredProducts = resp;
        
      }
    )

  }
  public fetchcategories()
  {
    this.http.get('http://localhost/restaurant/get_categories.php').subscribe(
      (resp:any) => {
        console.log(resp);
        this.categories=resp.categories;
        this.filteredCategories = resp.categories;
        
      }
    )

  }
  
  filterProducts(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredProducts = this.products.filter(product => 
      product.name.toLowerCase().includes(query)
    );
  }
  filterCategories(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredCategories = this.categories.filter(category => 
      category.name.toLowerCase().includes(query)
    );
  }

  deleteProduct(product: any) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent);

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
    this.userService.deleteItem(product.id).then(response => {
      if (response.success) {
        this.products = this.products.filter(p => p.id !== product.id);
        if (this.selectedProduct === product) {
          this.selectedProduct = null;
        }
      } else {
        console.error('Error deleting item:', response.message);
      }
    });
  }
});
}
  openEditDialog(item: any): void {
    const dialogRef = this.dialog.open(EditItemDialogComponent, {
      width: '400px',
      data: { item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Object.assign(this.selectedProduct, result);
      }
    });
  }
 
  adjustItem(item: any) {
    // this.isEditMode = true;
    this.editForm.patchValue(item);
  }
  saveChanges() {
    const updatedItem = this.editForm.value;
    const id = this.selectedProduct.id;

    this.userService.updateItem(id, updatedItem).then(response => {
      if (response.success) {
        Object.assign(this.selectedProduct, updatedItem);
        // this.isEditMode = false;
      } else {
        console.error('Error updating item:', response.message);
      }
    });
  }

  addCategory() {
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.addCategory(result).then(response => {
          if (response.success) {
            this.fetchcategories();
          } else {
            console.error('Error adding category:', response.message);
          }
        });
      }
    });
  }
 


  editCategory(category: any) {
    // Edit category logic here
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      width: '400px',
      data: { category }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateCategory(category.id, result).then(response => {
          if (response.success) {
            this.fetchcategories();
          } else {
            console.error('Error updating category:', response.message);
          }
        });
      }
    });
  }

  deleteCategory(category: any) {
    this.categories = this.categories.filter(c => c !== category);
  }
}