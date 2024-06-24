import { Component,OnInit,NgZone } from '@angular/core';
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
import { EditItemDialogComponent } from './edit-item-dialog/edit-item-dialog.component'; 
import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component';
import { EditCategoryDialogComponent } from './edit-category-dialog/edit-category-dialog.component';
import { ConfirmDialogComponent } from '../../layouts/confirm-dialog/confirm-dialog.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { AdditemComponent } from '../add-item/add-item.component'; 





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
    NgxPaginationModule
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
  p:number=1;
  itemsPerPage:number=7;
  // isEditMode: boolean = false;
  editForm: FormGroup;
  

  
  constructor(private router: Router,private userService: UserService,private http: HttpClient,private fb: FormBuilder,public dialog: MatDialog,private snackBar: MatSnackBar,private zone: NgZone) {
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
    const dialogRef = this.dialog.open(AdditemComponent, {
        width: '600px'
    });

    dialogRef.afterClosed().subscribe((result) => {
        if (result && result.success && result.item) {
            
            this.products.push(result.item);
            this.fetchproducts();
       
            this.filteredProducts = [...this.products];
        }
    });
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
    const userId = localStorage.getItem('userId');

    this.http.get(`http://localhost/restaurant/get-items.php?user_id=${userId}`).subscribe(
      (resp:any) => {
        console.log(resp);
        this.products=resp;
        this.filteredProducts = resp;
        

        
      }
    )

  }
  public fetchcategories()
  {
    const userId = localStorage.getItem('userId');
    this.http.get(`http://localhost/restaurant/get_categories.php?user_id=${userId}`).subscribe(
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

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data:{
        
        name:product.name}
    });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
    this.userService.deleteItem(product.id).then(response => {
      if (response.success) {
        this.fetchproducts();

        
        if (this.selectedProduct === product) {
          this.selectedProduct = null;
        }
        this.snackBar.open('Item deleted successfully', 'Close', {
          duration: 5000,
      });
      } else {
        this.snackBar.open(response.message, 'Close', {
          duration: 3000,
      });
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
        
            this.fetchcategories();
          } 
        });
      
    
  }
 


  editCategory(category: any) {
    
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
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: { name: category.name }
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            this.userService.deleteCategory(category.id).then(response => {
                console.log('Response from deleteCategory API:', response);

                this.snackBar.open(response.message, 'Close', { duration: 3000 });
                
                if (response.success) {
                    this.fetchcategories();
                }
            }).catch(error => {
                console.error('Error deleting category:', error);
                this.snackBar.open('Error deleting category', 'Close', { duration: 3000 });
            });
        }
    });
}


}  