import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../shared/services/user.service';
import { AddpartyComponent } from '../parties/addparty/addparty.component';
import { CurrencyPipe } from '@angular/common';

interface Item {
  id: number;
  item_code: string;
  name: string;
  quantity: number;
  unit: string;
  sale_price: number;
  discount: number;
  tax: number;
  total: number;
  category_id: number;
  tax_rate: number;
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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, DatePipe],
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

  constructor(private userService: UserService, private http: HttpClient, private router: Router, private route: ActivatedRoute, private dialog: MatDialog, private fb: FormBuilder) {
    this.billingForm = this.fb.group({
      customer_name: ['', Validators.required],
      subtotal: [0, Validators.required],
      total_amount: [0, Validators.required],
      payment_mode: ['', Validators.required],
      amount_received: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchParties();
  }

  fetchProducts(): void {
    this.http.get<Item[]>('http://localhost/restaurant/get-items.php').subscribe(
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
    this.http.get<Customer[]>('http://localhost/restaurant/get-parties.php').subscribe(
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
        this.parties.push(result.party);
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

  async saveBill() {
    const billData = {
      party_id: this.customerDetails ? this.customerDetails.id : null,
      subtotal: this.calculateSubtotal(),
      total_amount: this.calculateTotal(),
      payment_mode: this.paymentMode,
      amount_received: this.amountReceived
    };

    try {
      // Save the bill first and get the bill ID
      const saveBillResponse = await this.userService.saveBill(billData);
      if (!saveBillResponse.success) {
        this.errorMessage = saveBillResponse.message || 'Error saving bill';
        return;
      }
      this.billId = saveBillResponse.billId;

      // Save the items and quantities associated with the bill
      const itemsData = this.filteredProducts.map(item => ({
        Id: item.id, // Assuming you have an 'id' property for each item
        quantity: item.quantity
      }));

      const saveItemsResponse = await this.userService.saveBillItems(this.billId, itemsData);
      if (!saveItemsResponse.success) {
        this.errorMessage = saveItemsResponse.message || 'Error saving items';
        // Optionally, you may want to roll back the bill creation here if items saving fails
        return;
      }

      this.successMessage = 'Bill and items saved successfully!';
    } catch (error) {
      console.error('Error saving bill or items:', error);
      this.errorMessage = 'An error occurred while saving the bill or items. Please try again later.';
    }
  }

  viewBillDetails(): void {
    this.router.navigate(['/bill-details'], { queryParams: { bill_id: this.billId } });
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

  selectItem(item: Item): void {
    this.searchText = '';
    this.suggestedItems = [];
    this.noItemsFound = false;
    const selectedItem = { ...item, quantity: 1, total: this.calculateItemTotal(item) };
    this.filteredProducts.push(selectedItem);
    this.updateItemTotal(selectedItem);
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
  }

  calculateItemTotal(item: Item): number {
    if (isNaN(item.sale_price) || isNaN(item.discount) || isNaN(item.tax_rate) || isNaN(item.quantity)) {
      console.error(`Invalid input for item: ${item.name}`, item);
      return 0;
    }
    const subtotal = item.quantity * item.sale_price;
    const discountAmount = item.discount;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (item.tax_rate / 100) * taxableAmount;
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
        total += item.total;
        this.amountReceived = total;
      }
    });
    console.log('Total Amount:', total);
    return total;
  }

  calculateTotalDiscount(): number {
    const totalDiscount = this.filteredProducts.reduce((sum, item) => sum + item.discount, 0);
    console.log('Total Discount:', totalDiscount);
    return totalDiscount;
  }

  removeItem(index: number): void {
    this.filteredProducts.splice(index, 1);
  }

  calculateChange(): number {
    return this.amountReceived - this.calculateTotal();
  }
}
