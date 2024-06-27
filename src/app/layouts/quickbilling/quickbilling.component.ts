import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../shared/services/user.service';
import { AddpartyComponent } from '../parties/addparty/addparty.component';
import { CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

interface Item {
  id: number;
  item_code: string;
  name: string;
  quantity: number;
  unit: string;
  sale_price: number;
  discount: number;
  
  total: number;
  category_id: number;
  tax_rate: number;

  stock:number;
  tax: number;
}

interface Customer {
  id: number;
  name: string;
  phone: number;
}

@Component({
  selector: 'app-quickbilling',
  templateUrl: './quickbilling.component.html',
  styleUrls: ['./quickbilling.component.scss'],
  standalone: true,
  
  imports: [CommonModule, FormsModule, 
    ReactiveFormsModule, HttpClientModule, 
    DatePipe,MatButtonModule,MatIconModule,MatInputModule,
    MatSelectModule, MatAutocompleteModule,
    MatButtonToggleModule],
  providers: [CurrencyPipe]
})
export class QuickbillingComponent implements OnInit {
  searchText: string = '';
  customerSearchText: string = '';
  public parties: Customer[] = [];
  public filteredParties: Customer[] = [];
  public products: Item[] = [];
  public filteredProducts: Item[] = [];
  public suggestedItems: Item[] = [];
  public suggestedCustomers: Customer[] = [];
  public noItemsFound: boolean = false;
  public noCustomersFound: boolean = false;

  customerDetails: Customer | null = null;
  paymentMode: string = 'Cash';
  amountReceived: number = 0;
  billingForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  billId: number = 0;
  showStockWarning: boolean = false;
  additionalDiscount: number = 0;


  constructor(private userService: UserService, 
    private http: HttpClient, private router: Router, 
    private route: ActivatedRoute, private dialog: MatDialog, 
    private fb: FormBuilder) {
    this.billingForm = this.fb.group({
      customer_name: ['', Validators.required],
      subtotal: [0, Validators.required],
      total_amount: [0, Validators.required],
      payment_mode: ['', Validators.required],
      amount_received: [0, Validators.required],
      additional_discount: [0, Validators.required],
      total_tax: [0, Validators.required],
      total_discount: [0, Validators.required],
      
    });
  }


  searchControl = new FormControl('');
  customerControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<Item[]> = new Observable();
  filteredOptionsCustomer: Observable<Customer[]> = new Observable();


  ngOnInit(): void {
    this.fetchProducts();
    this.fetchParties();
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.filteredOptionsCustomer = this.customerControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCustomer(value || '')),
    );
  }

  private _filterCustomer(value: string): Customer[] {
    const filterValue = value.toLowerCase();
    debugger;
    let a = this.parties.filter(party =>
      party.name.toLowerCase().includes(filterValue)
    );
    return this.parties.filter(party =>
      party.name.toLowerCase().includes(filterValue)
    );
    
  }

  private _filter(value: string): Item[] {
    const filterValue = value.toLowerCase();
    debugger;
    return this.products.filter(product =>
      product.item_code.toLowerCase().includes(filterValue) ||
      product.name.toLowerCase().includes(filterValue)
    );
  }

  fetchProducts(): void {
    const userId = localStorage.getItem('userId');

    this.http.get<Item[]>(`http://localhost/restaurant/get-items.php?user_id=${userId}`).subscribe(
      (resp: Item[]) => {
        this.products = resp.map((item: any) => ({
          ...item,
          sale_price: parseFloat(item.sale_price),
          discount: parseFloat(item.discount),
          tax_rate: parseFloat(item.tax_rate || '0'),
          quantity: parseInt(item.quantity || '0', 10)
        }));
        console.log('Fetched products:', this.products);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  fetchParties(): void {
    const userId = localStorage.getItem('userId');

    this.http.get<Customer[]>(`http://localhost/restaurant/get-parties.php?user_id=${userId}`).subscribe(
      (resp: Customer[]) => {
        this.parties = resp;
        console.log('Fetched parties:', this.parties);
      },
      (error) => {
        console.error('Error fetching parties:', error);
      }
    );
  }

  openAddPartyDialog(): void {
    const dialogRef = this.dialog.open(AddpartyComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        const newCustomer: Customer = {
          id: result.party.id,
          name: result.party.name,
          phone: result.party.phone
        };
        this.parties.push(newCustomer);
        

        this.selectCustomer(newCustomer); 
        this.customerSearchText = '';

        this.noCustomersFound = false;
        this.suggestedCustomers = [];


      

      }
    });
  }

  searchItems(): void {
    if (this.searchText) {
      this.suggestedItems = this.products.filter(product =>
        product.item_code.toLowerCase().includes(this.searchText.toLowerCase()) ||
        product.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
      this.noItemsFound = this.suggestedItems.length === 0;
      console.log('Suggested items:', this.suggestedItems);
    } else {
      this.suggestedItems = [];
      this.noItemsFound = false;
    }
  }

  
  

  async saveAndViewBill() {
    const user_id = localStorage.getItem('userId');
    if (user_id === null) {
      this.errorMessage = 'User not logged in.';
      return;
    }
    
    this.successMessage = ''; 
    this.errorMessage = ''; 
    console.log('Before saving bill:', this.successMessage, this.errorMessage);
  
    // if (!this.customerDetails) {
    //   this.errorMessage = 'No customer selected.';
    //   return;
    // }

    const billData = {
      party_id: this.customerDetails ? this.customerDetails.id : null,  // Allowing null for party_id
      subtotal: this.calculateSubtotal(),
      total_amount: this.calculateTotal(),
      payment_mode: this.paymentMode,
      additional_discount: this.additionalDiscount,
      total_tax: this.calculateTotalTax(),
      total_discount: this.calculateTotalDiscount(),
      
      
      amount_received: this.amountReceived,
      user_id:user_id,
      
    };
  
    const itemsData = this.filteredProducts.map(item => ({
      Id: item.id,
      quantity: item.quantity
    }));
  
    try {
      // Save bill and items
      const response = await this.userService.saveBillWithItems(billData, itemsData);
      console.log('Save bill with items response:', response);
  
      if (response && response.success) {
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          width: '400px',
          data: { billId: response.billId }, // Pass billId as data
        });
        dialogRef.afterClosed().subscribe(() => {
          console.log('Dialog closed');
          
        });
      } else {
        this.errorMessage = response?.message || 'Error saving bill and items';
      }
    } catch (error) {
      console.error('Error saving bill or items:', error);
      this.errorMessage = 'An error occurred while saving the bill or items. Please try again later.';
    }
  }
  

  searchParties(): void {
    if (this.customerSearchText) {
      this.suggestedCustomers = this.parties.filter(party =>
        party.name.toLowerCase().includes(this.customerSearchText.toLowerCase())
      );
      this.noCustomersFound = this.suggestedCustomers.length === 0;
      console.log('Suggested customers:', this.suggestedCustomers);
    } else {
      this.suggestedCustomers = [];
      this.noCustomersFound = false;
    }
  }

  selectItemById(id: string){
    let item = this.products.filter(f=> f.id);
    if(!item) return;
    this.selectItem(item[0]);
    this.searchControl.setValue('');
  }

  selectItem(item: Item): void {
    debugger;
    this.searchText = '';
    this.suggestedItems = [];
    this.noItemsFound = false;
    const selectedItem = { ...item, quantity: 1, total: this.calculateItemTotal(item) };
    
    if (selectedItem.quantity > item.stock) {
      this.showStockWarning = true; 
    } else {
      this.filteredProducts.push(selectedItem);
      this.updateItemTotal(selectedItem);
    }

  }

  selectCustomerByID(id: number){
    let customer = this.parties.filter(f=> f.id == id);
    if(customer?.length) this.selectCustomer(customer[0]);
    this.customerControl.setValue('');
  }
  selectCustomer(customer: Customer): void {
    this.customerSearchText = '';
    this.suggestedCustomers = [];
    this.noCustomersFound = false;
    this.customerDetails = {
      id: customer.id,
      name: customer.name,
      phone: customer.phone
    };
    console.log('Selected customer:', this.customerDetails); 

  }

  calculateItemTotal(item: Item): number {
    if (isNaN(item.sale_price) || isNaN(item.discount) || isNaN(item.tax_rate) || isNaN(item.quantity)) {
      console.error(`Invalid input for item: ${item.name}`, item);
      return 0;
    }
    const subtotal = item.quantity * item.sale_price;
    const discountAmount = item.discount;
    const taxableAmount = subtotal - (item.quantity*discountAmount);
    const taxAmount = (item.tax_rate / 100) * taxableAmount;
    item.tax = taxAmount;
    const total = taxableAmount + taxAmount;
    console.log(`Item: ${item.name}, Subtotal: ${subtotal}, Discount: ${discountAmount}, Tax: ${taxAmount}, Total: ${total}`);
    return total;
  }

  updateItemTotal(item: Item): void {
    item.total = this.calculateItemTotal(item);
  }

  onQuantityChange(item: Item): void {
    
    if (item.quantity > item.stock) {
      this.showStockWarning = true; 
    } else {
      this.showStockWarning = false;
      this.updateItemTotal(item);
    }

  }

  calculateSubtotal(): number {
    const subtotal = this.filteredProducts.reduce((sum, item) => sum + (item.sale_price * item.quantity), 0);
    console.log('Subtotal:', subtotal);
    return subtotal;
  }

  calculateTotal(): number {
    let total = 0;
    this.filteredProducts.forEach(item => {
      console.log(`Item: ${item.name}, Total: ${item.total}`);
      if (isNaN(item.total)) {
        console.error(`Error: Item total is NaN for item: ${item.name}`);
      } else {
        const additionalDiscount = this.additionalDiscount || 0;

        total += item.total;
        
        this.amountReceived = total-additionalDiscount;
      }
    });
    console.log('Total Amount:', total);
    return total;
  }

  calculateTotalDiscount(): number {
    const totalDiscount = this.filteredProducts.reduce((sum, item) => sum + (item.quantity*item.discount), 0);
    console.log('Total Discount:', totalDiscount);
    return totalDiscount;
  }

  calculateTotalTax(): number {
    const totalTax = this.filteredProducts.reduce((sum, item) => {
      const subtotal = item.quantity * item.sale_price;
      const discountAmount = item.quantity * item.discount;  // Apply discount per quantity
      const taxableAmount = subtotal - discountAmount;
      const taxAmount = (item.tax_rate / 100) * taxableAmount;
      console.log(`Item: ${item.name}, Subtotal: ${subtotal}, Discount: ${discountAmount}, Tax Amount: ${taxAmount}`);
      return sum + taxAmount;
    }, 0);
    console.log('Total Tax:', totalTax);
    return totalTax;
  }
  

  removeItem(index: number): void {
    this.filteredProducts.splice(index, 1);
  }

  calculateChange(): number {
    return this.amountReceived - this.calculateTotal();
  }
}






