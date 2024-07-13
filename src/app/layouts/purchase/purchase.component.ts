import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../shared/services/user.service';
import { AddpartyComponent } from '../parties/addparty/addparty.component';
import { AdditemComponent } from '../add-item/add-item.component';

import { CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import Swal from 'sweetalert2';

interface Item {
  id: number;
  item_code: string;
  name: string;
  quantity: number;
  unit: string;
  purchase_price: number;
  discount: number;
  
  total: number;
  category_id: number;
  tax_rate: number;
  tax: number;
  discountAmount?: number; 

  
}

interface Customer {
  id: number;
  name: string;
  phone: number;
}

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [CommonModule, FormsModule, 
    ReactiveFormsModule, HttpClientModule, 
    DatePipe,MatButtonModule,MatIconModule,MatInputModule,
    MatSelectModule, MatAutocompleteModule,
    MatButtonToggleModule],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.scss'
})
export class PurchaseComponent implements OnInit {
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
  
  purchaseForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  purchaseId: number = 0;
  
  
  isEditMode:boolean=false;

  constructor(private userService: UserService, 
    private http: HttpClient, private router: Router, 
    private route: ActivatedRoute, private dialog: MatDialog, 
    private fb: FormBuilder) {
    this.purchaseForm = this.fb.group({
      customer_name: ['', Validators.required],
      subtotal: [0, Validators.required],
      total_amount: [0, Validators.required],
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
    this.route.queryParams.subscribe(params => {
      this.purchaseId = params['purchase_id'];
      console.log('Fetched purchase ID:', this.purchaseId);  

      this.isEditMode = !!this.purchaseId;
      if (this.isEditMode) {
          this.loadPurchaseDetails(this.purchaseId);
      }
  });
    
   
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
          purchase_price: parseFloat(item.purchase_price)
          // discount: parseFloat(item.discount),
          // tax_rate: parseFloat(item.tax_rate || '0'),
          // quantity: parseInt(item.quantity || '0', 10)
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
  openAddItemDialog(): void {
    const dialogRef = this.dialog.open(AdditemComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        const newItem: Item = {
          id: result.item.id,
          item_code: result.item.item_code,
          name: result.item.name,
          
          quantity: result.item.quantity,
          unit: result.item.unit,
          purchase_price: result.item.purchase_price,

          discount: result.item.discount,
          
          total:this.calculateTotal(),
          discountAmount:this.calculateTotal(),
          category_id: result.item.category_id,
          tax_rate: result.item.tax_rate,
        
          // stock:result.item.stock,
          tax: result.item.tax
          

        };
        this.products.push(newItem);
        

        this.selectItem(newItem); 
        this.searchText = '';

        this.noItemsFound = false;
        this.suggestedItems = [];


      

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

  
  

  async savePurchase() {
    const user_id = localStorage.getItem('userId');
    if (user_id === null) {
      this.errorMessage = 'User not logged in.';
      return;
    }
    
    this.successMessage = ''; 
    this.errorMessage = ''; 
    console.log('Before saving purchase:', this.successMessage, this.errorMessage);
  
    // if (!this.customerDetails) {
    //   this.errorMessage = 'No customer selected.';
    //   return;
    // }

    const billData = {
      party_id: this.customerDetails ? this.customerDetails.id : null,  // Allowing null for party_id
      subtotal: this.calculateSubtotal(),
      total_amount: this.calculateTotal(),
      // payment_mode: this.paymentMode,
      // additional_discount: this.additionalDiscount,
      total_tax: this.calculateTotalTax(),
      total_discount: this.calculateTotalDiscount(),
      
      
      // amount_received: this.amountReceived,
      user_id:user_id,
      
    };
  
    const itemsData = this.filteredProducts.map(item => ({
      Id: item.id,
      quantity: item.quantity,     
      discount: item.discount,
      tax: item.tax,
      purchase_price:item.purchase_price




    }));
  
    try {
      // Save bill and items
      const response = await this.userService.savePurchaseWithItems(billData, itemsData);
      console.log('Save bill with items response:', response);
  
      if (response && response.success) {
        Swal.fire(`Purchase saved successfully `);

      } else {
        this.errorMessage = response?.message || 'Error saving purchase and items';
      }
    } catch (error) {
      console.error('Error saving purchase or items:', error);
      this.errorMessage = 'An error occurred while saving the purchase or items. Please try again later.';
    }
  }
  loadPurchaseDetails(purchaseId: number): void {
    console.log("Fetching purchase details for purchase ID:", purchaseId);
    const userId = localStorage.getItem('userId');
  
    this.http.get(`http://localhost/restaurant/get_bill_details_for_edit.php?bill_id=${purchaseId}&user_id=${userId}`)
      .subscribe((response: any) => {
        if (response.success) {
          const purchase = response.purchase;
  
          
          this.customerDetails = this.parties.find(party => party.id === purchase.party_id) || null;
  
          // Set the form values 
          this.purchaseForm.patchValue({
            customer_name: this.customerDetails ? this.customerDetails.name : '',
            subtotal: parseFloat(purchase.subtotal),
            total_amount: parseFloat(purchase.total_amount),
            // payment_mode: purchase.payment_mode,
            // amount_received: parseFloat(purchase.amount_received),
            // additional_discount: parseFloat(purchase.additional_discount),
            total_tax: parseFloat(purchase.total_tax),
            total_discount: parseFloat(purchase.total_discount),
          });
  
          // Map items to filteredProducts array
          this.filteredProducts = response.items.map((item: any) => {
            const product = this.products.find(product => product.id === item.item_id);
            if (product) {
              // Calculate discountAmount and tax for each item
              const total = this.calculateItemTotal({
                ...product,
                quantity: item.quantity,
              });
              const discountAmount = this.calculateItemDiscount({
                ...product,
                quantity: item.quantity,
                discount: product.discount 
              });
              const taxAmount = this.calculateItemTax({
                ...product,
                quantity: item.quantity,
                tax: product.tax
              });          
              return {
                ...product,
                quantity: item.quantity,
                total: total,
                discountAmount: discountAmount,
                tax: taxAmount, 
              };
            } else {
              console.warn(`Product with id ${item.item_id} not found`);
              return {
                id: item.item_id,
                item_code: '',
                name: '',
                quantity: item.quantity,
                unit: '',
                purchase_price: 0,
                discount: 0,
                total: 0,
                category_id: 0,
                // tax_rate: 0,
                // stock: 0,
                tax: 0,
                discountAmount: 0, 
              };
            }
          });
          
          this.calculateTotal();
  
          console.log("Purchase details loaded:", purchase);
          console.log("Items loaded:", this.filteredProducts);
        } else {
          console.error('Error fetching purchase details:', response.message);
        }
      }, (error) => {
        console.error('Error fetching purchase details:', error);
      });
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

  selectItemById(id: number){
    debugger;
    let item = this.products.filter(f=> f.id == id);
    if(!item) return;
    this.selectItem(item[0]);
    this.searchControl.setValue('');
  }

  selectItem(item: Item): void {
    this.searchText = '';
    this.suggestedItems = [];
    this.noItemsFound = false;
    const selectedItem = { ...item, quantity: 1, total: this.calculateItemTotal(item),discount: 0, tax_rate: 0 };

    
   
      this.filteredProducts.unshift(selectedItem);
      this.updateItemTotal(selectedItem);
    

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
    if (isNaN(item.purchase_price) || isNaN(item.discount) || isNaN(item.tax_rate) || isNaN(item.quantity)) {
      console.error(`Invalid input for item: ${item.name}`, item);
      return 0;
    }
    const subtotal = item.quantity * item.purchase_price;
    const discountAmount = (item.discount / 100) * subtotal;
    item.discountAmount = discountAmount;
    const taxableAmount = subtotal - discountAmount;
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
    
     
      
      

      this.updateItemTotal(item);
    

  }

  calculateSubtotal(): number {
    const subtotal = this.filteredProducts.reduce((sum, item) => sum + (item.purchase_price * item.quantity), 0);
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
        // const additionalDiscount = this.additionalDiscount || 0;

        total += item.total;
        
        // this.amountReceived = total-additionalDiscount;
      }
    });
    console.log('Total Amount:', total);
    return total;
  }
  calculateItemDiscount(item: Item): number {
    const discountAmount = (item.discount / 100) * item.purchase_price * item.quantity;
    return discountAmount;
  }
  
 calculateItemTax(item: Item): number {
  const discountAmount = item.discountAmount || 0; // Handle undefined case
  const taxableAmount = (item.quantity * item.purchase_price) - discountAmount;
  const taxAmount = (item.tax_rate / 100) * taxableAmount;
  item.tax = taxAmount;
  return taxAmount;
}


  calculateTotalDiscount(): number {
    return this.filteredProducts.reduce((sum, item) => sum + this.calculateItemDiscount(item), 0);
  }

  calculateTotalTax(): number {
    const totalTax = this.filteredProducts.reduce((sum, item) => {
      const subtotal = item.quantity * item.purchase_price;
      const discountAmount = (item.discount / 100) * subtotal;
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

  // calculateChange(): number {
  //   // return this.amountReceived - this.calculateTotal();
  // }
}
