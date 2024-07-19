import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../shared/services/user.service';
import { AddpartyComponent } from '../../parties/addparty/addparty.component';
import { AddSalespersonsComponent } from '../add-salespersons/add-salespersons.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import Swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';

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
  discountAmount?: number; 

  
}

interface Customer {
  id: number;
  name: string;
  phone: number;
}
interface Salesperson {
  id: number;
  name: string;
}

@Component({
  selector: 'app-add-quote',
  standalone: true,
  
  imports: [CommonModule, FormsModule, 
    ReactiveFormsModule, HttpClientModule,

    DatePipe,MatButtonModule,MatIconModule,MatInputModule,
    MatSelectModule, MatAutocompleteModule,
    MatButtonToggleModule, MatDatepickerModule,
    MatNativeDateModule],
  providers: [CurrencyPipe],
  templateUrl: './add-quote.component.html',
  styleUrl: './add-quote.component.scss'
})
export class AddQuoteComponent implements OnInit {

  searchText: string = '';
  customerSearchText: string = '';
  salespersonSearchText: string = '';


  public parties: Customer[] = [];
  public filteredParties: Customer[] = [];

  public products: Item[] = [];
  public filteredProducts: Item[] = [];

  public salespersons: Salesperson[] = [];
  public filteredSalespersons: Salesperson[] = [];

  public suggestedItems: Item[] = [];
  public suggestedCustomers: Customer[] = [];
  public suggestedSalespersons: Salesperson[] = [];


  public noItemsFound: boolean = false;
  public noCustomersFound: boolean = false;

  customerDetails: Customer | null = null;
  salespersonDetails: Salesperson | null = null;

  searchControl = new FormControl('');
  customerControl = new FormControl('');
  salespersonControl = new FormControl('');

  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<Item[]> = new Observable();
  filteredOptionsCustomer: Observable<Customer[]> = new Observable();
  filteredOptionsSalesperson: Observable<Salesperson[]> = new Observable();


  // paymentMode: string = 'Cash';
  amountReceived: number = 0;
  qouteForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  qouteId: number = 0;
  // showStockWarning: boolean = false;
  additionalDiscount: number = 0;
  isEditMode:boolean=false;
  quotationDate: Date | null = null;
  expiryDate: Date | null = null;


  constructor(private userService: UserService, 
    private http: HttpClient, private router: Router, 
    private route: ActivatedRoute, private dialog: MatDialog, 
    private fb: FormBuilder) {
    this.qouteForm = this.fb.group({
      customer_name: ['', Validators.required],
      salesperson_name: ['', Validators.required],
      quotationDate: [''],
      expiryDate: [''],
      subject: [''], // Ensure subject is included here

      subtotal: [0, Validators.required],
      total_amount: [0, Validators.required],
      // payment_mode: ['', Validators.required],
      amount_received: [0, Validators.required],
      additional_discount: [0, Validators.required],
      total_tax: [0, Validators.required],
      total_discount: [0, Validators.required],
      
    });
  }


  


  ngOnInit(): void {
    this.fetchProducts();
    this.fetchParties();
    this.fetchSalespersons();

    this.route.queryParams.subscribe(params => {
      this.qouteId = params['quote_id'];
      console.log('Fetched qoute ID:', this.qouteId);  

      this.isEditMode = !!this.qouteId;
      if (this.isEditMode) {
          this.loadQuoteDetails(this.qouteId);
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
    this.filteredOptionsSalesperson = this.salespersonControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterSalesperson(value || '')),
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

  private _filterSalesperson(value: string): Salesperson[] {
    const filterValue = value.toLowerCase();
    debugger;
    let a = this.salespersons.filter(person =>
      person.name.toLowerCase().includes(filterValue)
    );
    return this.salespersons.filter(person =>
      person.name.toLowerCase().includes(filterValue)
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
 navigate()
 {
  this.router.navigate(['/dashboard/quote']);

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

  fetchSalespersons(): void {
    const companyId = localStorage.getItem('userId');

    this.http.get<Salesperson[]>(`http://localhost/restaurant/get-salespersons.php?company_id=${companyId}`).subscribe(
      (resp: Salesperson[]) => {
        this.salespersons = resp;
        console.log('Fetched salespersons:', this.salespersons);
      },
      (error) => {
        console.error('Error fetching salespersons:', error);
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
        this.customerControl.setValue(newCustomer.name);
        this.customerSearchText = '';

        this.noCustomersFound = false;
        this.suggestedCustomers = [];
      }
    });
  }

  openAddSalespersonDialog(): void {
    const dialogRef = this.dialog.open(AddSalespersonsComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        this.salespersons.push(result.person);
        this.fetchSalespersons();
        this.salespersonDetails = { id: result.person.id, name: result.person.name }; // Auto-select new party

        this.filteredSalespersons = [...this.salespersons];
        this.salespersonControl.setValue(result.person.name);
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

  
  

  async saveAndViewQuote() {
    const user_id = localStorage.getItem('userId');
    if (user_id === null) {
      this.errorMessage = 'User not logged in.';
      return;
    }
    
    this.successMessage = ''; 
    this.errorMessage = ''; 
    console.log('Before saving qoute:', this.successMessage, this.errorMessage);
    
  
    if (!this.customerDetails) {
      this.errorMessage = 'No customer selected.';
      return;
    }

    if (!this.quotationDate) {
      this.errorMessage = 'Please select Quote date';
      return;
    }



    const qouteData = {
      qoute_id: this.qouteId, // Include the qoute ID

      party_id: this.customerDetails ? this.customerDetails.id : null,  // Allowing null for party_id
      person_id: this.salespersonDetails ? this.salespersonDetails.id : null,  // Allowing null for person_id
      quote_date:this.quotationDate,
      expiry_date:this.expiryDate,
      subject: this.qouteForm.get('subject')?.value, // Access subject from form

      subtotal: this.calculateSubtotal(),
      total_amount: this.calculateTotal(),
      // payment_mode: this.paymentMode,
      additional_discount: this.additionalDiscount,
      total_tax: this.calculateTotalTax(),
      total_discount: this.calculateTotalDiscount(),
      amount_received: this.amountReceived,
      user_id:user_id,
      
    };
    console.log("quote data",qouteData);
  
    const itemsData = this.filteredProducts.map(item => ({
      Id: item.id,
      quantity: item.quantity
    }));
  
    try {
      // Save qoute and items
      const response = await this.userService.saveQuoteWithItems(qouteData, itemsData);
      console.log('Save qoute with items response:', response);
      console.log("get quote id",response.quoteId);
  
      if (response && response.success) {
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          width: '400px',
          data: {quoteId: response.quoteId }, // Pass qouteId as data
          
        });
        
        dialogRef.afterClosed().subscribe(() => {
          
          console.log('Dialog closed');
          
        });
      } else {
        this.errorMessage = response?.message || 'Error saving quote and items';
      }
    } catch (error) {
      console.error('Error saving quote or items:', error);
      this.errorMessage = 'An error occurred while saving the quote or items. Please try again later.';
    }
  }
  loadQuoteDetails(qouteId: number): void {
    console.log("Fetching quote details for quote ID:", qouteId);
    const userId = localStorage.getItem('userId');
  
    this.http.get(`http://localhost/restaurant/get_quote_details.php?quote_id=${qouteId}&user_id=${userId}`)
      .subscribe((response: any) => {
        if (response.success) {
          const quote = response.quote;
          this.customerDetails = this.parties.find(party => party.id === quote.party_id) || null;
          this.salespersonDetails = this.salespersons.find(sp => sp.id === quote.salesperson_id) || null;

        

          this.qouteForm.patchValue({
            customerControl: this.customerDetails ? this.customerDetails.id : null,
            salesperson_name: this.salespersonDetails ? this.salespersonDetails.name : '', // Set salesperson name
            
            subject: quote.subject,
          
          });
          this.quotationDate = new Date(quote.quote_date);
          this.expiryDate = new Date(quote.expiry_date);
          console.log('Quote details loaded:', quote);
          console.log('Selected customer:', this.customerDetails);
          console.log('Selected salesperson:', this.salespersonDetails);

          if (this.customerDetails) {
            this.customerControl.setValue(this.customerDetails.name);
          }
          if (this.salespersonDetails) {
            this.salespersonControl.setValue(this.salespersonDetails.name);
          }

          if (Array.isArray(response.items)) {
            this.filteredProducts = [];

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
                  sale_price: 0,
                  discount: 0,
                  total: 0,
                  category_id: 0,
                  tax_rate: 0,
                  stock: 0,
                  tax: 0,
                  discountAmount: 0, 
                };
              }
            });

          } else {
            this.filteredProducts = [];
            console.warn('Items data is not an array:', response.data.items);
          }
          
          this.calculateTotal();
  
          console.log("quote details loaded:", quote);
          console.log("Items loaded:", this.filteredProducts);
        } else {
          console.error('Error fetching quote details:', response.message);
        }
      }, (error) => {
        console.error('Error fetching quote details:', error);
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
    const selectedItem = { ...item, quantity: 1, total: this.calculateItemTotal(item) };
    
    // if (selectedItem.quantity > item.stock) {
    //   this.showStockWarning = true; 
    //   Swal.fire(`Stock not available for selected quantity. Available stock as ${item.stock}`);
    // } else {
      this.filteredProducts.unshift(selectedItem);
      this.updateItemTotal(selectedItem);
    

  }

  selectCustomerByID(id: number){
    let customer = this.parties.filter(f=> f.id == id);
    if(customer?.length) this.selectCustomer(customer[0]);
    this.customerControl.setValue(customer[0].name);
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

  selectSalesperson(name: string): void {
    this.salespersonSearchText = '';
    const salesperson = this.salespersons.find(p => p.name === name);
    if (salesperson) {
      this.salespersonDetails = {
        id: salesperson.id,
        name: salesperson.name,
        
      };
    }
    this.salespersonControl.setValue(name);
    console.log('Selected salesperson:', this.salespersonDetails);
  }

  

  calculateItemTotal(item: Item): number {
    if (isNaN(item.sale_price) || isNaN(item.discount) || isNaN(item.tax_rate) || isNaN(item.quantity)) {
      console.error(`Invalid input for item: ${item.name}`, item);
      return 0;
    }
    const subtotal = item.quantity * item.sale_price;
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
    
    // if (item.quantity > item.stock) {
    //   Swal.fire(`Stock not available for selected quantity. Available stock as ${item.stock}`);
    //   this.showStockWarning = true; 
    //   item.quantity = 1;
    // } else {
    //   this.showStockWarning = false;
      

      this.updateItemTotal(item);
    

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
  calculateItemDiscount(item: Item): number {
    const discountAmount = (item.discount / 100) * item.sale_price * item.quantity;
    return discountAmount;
  }
  
 calculateItemTax(item: Item): number {
  const discountAmount = item.discountAmount || 0; // Handle undefined case
  const taxableAmount = (item.quantity * item.sale_price) - discountAmount;
  const taxAmount = (item.tax_rate / 100) * taxableAmount;
  item.tax = taxAmount;
  return taxAmount;
}


  calculateTotalDiscount(): number {
    return this.filteredProducts.reduce((sum, item) => sum + this.calculateItemDiscount(item), 0);
  }

  calculateTotalTax(): number {
    const totalTax = this.filteredProducts.reduce((sum, item) => {
      const subtotal = item.quantity * item.sale_price;
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

  

  calculateChange(): number {
    return this.amountReceived - this.calculateTotal();
  }

}
