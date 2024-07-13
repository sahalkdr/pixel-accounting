import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserService } from '../../../shared/services/user.service';  // Adjust the path as needed
import { AddPaymentOutComponent } from './add-payment-out/add-payment-out.component';
import Swal from 'sweetalert2';
interface Customer {
  id: number;
  name: string;
  phone: number;
}
interface Payment_out {
  customer_name: string;
  amount: string;
  payment_date: string;
}

interface Payment_outDetails {
  success: boolean;
  message: string;
  payment_out?: Payment_out[];
}



@Component({
  selector: 'app-payment-out',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    NgxPaginationModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './payment-out.component.html',
  styleUrls: ['./payment-out.component.scss']
})
export class PaymentOutComponent implements OnInit {
  payment_out_details: Payment_outDetails = { success: true, message: '', payment_out: [] };
  totalPaidAmount: number = 0;

  noRecords: boolean = false;
  fromDate: string = '';
  toDate: string = '';
  itemsPerPage: number = 13;
  p: number = 1;
  customerSearchText: string = '';
  parties: Customer[] = [];
  filteredParties: Customer[] = [];
  suggestedCustomers: Customer[] = [];
  noCustomersFound: boolean = false;
  customerDetails: Customer | null = null;

  customerControl = new FormControl('');
  filteredOptionsCustomer: Observable<Customer[]> = new Observable();

  paymentForm: FormGroup = new FormGroup({
    payment_date: new FormControl('', Validators.required),
    amount: new FormControl('', [Validators.required, Validators.min(0.01)])
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    private userService: UserService  // Assuming you have a UserService for API interactions
  ) {}

  ngOnInit(): void {
    this.fetchParties();

    this.filteredOptionsCustomer = this.customerControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCustomer(value || ''))
    );
    this.fetchPaymentOutDetails();

  }

  private _filterCustomer(value: string): Customer[] {
    const filterValue = value.toLowerCase();
    return this.parties.filter(party =>
      party.name.toLowerCase().includes(filterValue)
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
  navigateToAddPaymentOut() {
    const dialogRef = this.dialog.open(AddPaymentOutComponent, {
        width: '900px'
        // ,
        // height:'100%'
    });

    dialogRef.afterClosed().subscribe((result) => {
        
            this.fetchPaymentOutDetails();
       
            
        
    });
}

  calculateTotalPaidAmount(): void {
    if (this.payment_out_details.payment_out && this.payment_out_details.payment_out.length > 0) {
        this.totalPaidAmount = this.payment_out_details.payment_out.reduce((total, payment_out) => {
            const amount = parseFloat(payment_out.amount);
            if (isNaN(amount)) {
                console.error(`Invalid amount value: ${payment_out.amount}`);
                return total;
            }
            console.log('Processing amount:', amount);
            return total + amount;
        }, 0);
        console.log('Total Paid Amount:', this.totalPaidAmount);
    } else {
        this.totalPaidAmount = 0;
        console.log('No payment records found');
    }
}

  

  

  onInputFocus(): void {
    this.filteredOptionsCustomer = this.customerControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCustomer(value || ''))
    );
  }

  selectCustomer(name: string): void {
    this.customerSearchText = '';
    this.suggestedCustomers = [];
    this.noCustomersFound = false;
    const customer = this.parties.find(p => p.name === name);
    if (customer) {
      this.customerDetails = {
        id: customer.id,
        name: customer.name,
        phone: customer.phone
      };
    }
    this.customerControl.setValue(name);  // Update the search field with the selected customer's name
    console.log('Selected customer:', this.customerDetails);
  }

  savePaymentout(): void {
    
  
    // Format the date to YYYY-MM-DD
    const formattedDate = this.paymentForm.get('payment_date')?.value ?
      new Date(this.paymentForm.get('payment_date')?.value).toISOString().split('T')[0] : '';
  
    const payload = {
      party_id: this.customerDetails ? this.customerDetails.id : null,  // Allowing null for party_id

     
      amount: parseFloat(this.paymentForm.get('amount')?.value),
      payment_date: formattedDate,
      user_id: parseInt(localStorage.getItem('userId') || '0', 10)
    };
  
    this.userService.addPaymentOut(payload).then(response => {
      if (response.success) {
        Swal.fire(`Payment Out saved successfully `);
        console.log('Payment out recorded successfully:', response.message);
      } else {
        console.error('Error recording payment out:', response.message);
      }
    }).catch(error => {
      console.error('Error recording payment out:', error);
    });
  }
  filterByDateRange() {
    const fromDateInput = document.getElementById('from-date') as HTMLInputElement;
    const toDateInput = document.getElementById('to-date') as HTMLInputElement;
    const partyNameInput = document.getElementById('party-name') as HTMLInputElement;
    

    const fromDate = fromDateInput ? this.formatDate(fromDateInput.value) : '';
    const toDate = toDateInput ? this.formatDate(toDateInput.value) : '';
    const partyName = partyNameInput ? (partyNameInput.value ? partyNameInput.value.trim() : '') : '';
    
    const userId = localStorage.getItem('userId');

    this.fromDate = fromDate;
    this.toDate = toDate;

    
    console.log('From Date:', fromDate);
    console.log('To Date:', toDate);

    let url = `http://localhost/restaurant/get_payment_out_details.php?from_date=${fromDate}&to_date=${toDate}&user_id=${userId}`;

    if (partyName !== '') {
      url += `&party_name=${encodeURIComponent(partyName)}`;
    }

  
    

    this.http.get<Payment_outDetails>(url).subscribe(
      (resp: Payment_outDetails) => {
        if (resp.success) {
          if (resp.payment_out) {
            this.payment_out_details.payment_out = resp.payment_out;
          } else {
            this.payment_out_details.payment_out = [];

            this.noRecords = true;
            this.p = 1;
          }
          this.noRecords = false;
        } else {
          this.payment_out_details.payment_out = [];

          this.noRecords = true;
          this.p = 1;
        }
        this.calculateTotalPaidAmount();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
  formatDate(dateString: string): string {
    const parts = dateString.split('/');
    if (parts.length !== 3) {
      return '';
    }
    return `${parts[2]}-${parts[0]}-${parts[1]}`;
  }

  fetchPaymentOutDetails(): void {
    const userId = localStorage.getItem('userId');
  
    this.http.get<Payment_outDetails>(`http://localhost/restaurant/get_payment_out_details.php?user_id=${userId}`).subscribe(
      (resp: Payment_outDetails) => {
        if (resp.success) {
          this.payment_out_details = resp;

          console.log("Fetched payment_out details:", this.payment_out_details);
          this.calculateTotalPaidAmount(); // Call the function here after fetching details

          this.noRecords = false;
        } else {
          this.payment_out_details.payment_out = [];
          console.log("No records found:", resp.message);
          this.noRecords = true;
        }
      },
      (error) => {
        console.error('Error fetching payment out details:', error);
        this.payment_out_details.payment_out = [];
        this.noRecords = true;
      }
    );
  }
  
  
}
