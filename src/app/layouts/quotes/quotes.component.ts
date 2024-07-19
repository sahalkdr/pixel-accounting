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
import { HttpClientModule } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserService } from '../../shared/services/user.service';  // Adjust the path as needed
import { AddQuoteComponent } from './add-quote/add-quote.component';
import Swal from 'sweetalert2';


interface Quote {
  quote_id: string;
  customer_name: string;
  // total_tax: string;
  // total_amount: string;
  // payment_mode: string;
  amount_received: string;
  quote_date: string;
}
interface QuoteDetails {
  success: boolean;
  message: string;
  quotes?: Quote[];
}



@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss'],
  standalone: true,
  
  imports: [
    CommonModule,
    MatIconModule,
    NgxPaginationModule,
    MatButtonModule,
    MatInputModule,
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    FormsModule,HttpClientModule,
    ReactiveFormsModule
  ],
})
export class QuotesComponent implements OnInit {

  quotedetails: QuoteDetails = { success: true, message: '', quotes: [] };
  // totalPaidAmount: number = 0;

  noRecords: boolean = false;
  fromDate: string = '';
  toDate: string = '';
  itemsPerPage: number = 9;
  p: number = 1;
  

 

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    private userService: UserService  // Assuming you have a UserService for API interactions
  ) {}

  ngOnInit(): void {
   this.fetchQuoteDetails();
}

editbill(qouteId: string): void {
  console.log('Navigating to add_quote with quote_id:', qouteId);  // Debugging line
  this.router.navigate(['/add_quotes'], { queryParams: { quote_id: qouteId } });
}
 
  navigateToAddQuote() {
    
    this.router.navigate(['/add_quotes'] );

    
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

    let url = `http://localhost/restaurant/get_all_quote_details.php?from_date=${fromDate}&to_date=${toDate}&user_id=${userId}`;

    if (partyName !== '') {
      url += `&party_name=${encodeURIComponent(partyName)}`;
    }

  
    

    this.http.get<QuoteDetails>(url).subscribe(
      (resp: QuoteDetails) => {
        if (resp.success) {
          if (resp.quotes) {
            this.quotedetails.quotes = resp.quotes;
          } else {
            this.quotedetails.quotes = [];

            this.noRecords = true;
            this.p = 1;
          }
          this.noRecords = false;
        } else {
          this.quotedetails.quotes = [];

          this.noRecords = true;
          this.p = 1;
        }
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

  fetchQuoteDetails(): void {
    const userId = localStorage.getItem('userId');
  
    this.http.get<QuoteDetails>(`http://localhost/restaurant/get_all_quote_details.php?user_id=${userId}`).subscribe(
      (resp: QuoteDetails) => {
        if (resp.success) {
          this.quotedetails = resp;

          console.log("Fetched quote details:", this.quotedetails);

          this.noRecords = false;
        } else {
          this.quotedetails.quotes = [];
          console.log("No records found:", resp.message);
          this.noRecords = true;
        }
      },
      (error) => {
        console.error('Error fetching quote details:', error);
        this.quotedetails.quotes = [];
        this.noRecords = true;
      }
    );
  }

  printPage(): void {
    const printContents = document.getElementById('print-area')?.innerHTML;
    if (printContents) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  }
}