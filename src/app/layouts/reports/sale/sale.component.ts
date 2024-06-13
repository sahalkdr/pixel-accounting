import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { formatDate } from '@angular/common';



interface SaleDetails {
  success: boolean;
  message: string;
  company_info?: {
    name: string;
    place: string;
    phone: string;
  };
  bills?: Bill[];
}
  interface Bill {
    bill_id: string;
    customer_name: string;
    total_tax: string;
    total_amount: string;
    payment_mode: string;
    amount_received: string;
    created_at: string;
  }

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [CommonModule,
     MatIconModule,
     NgxPaginationModule,
     MatButtonModule,
     MatInputModule,
     MatSelectModule,
     MatFormFieldModule,
     MatDatepickerModule,
     MatNativeDateModule,
     FormsModule,
     ReactiveFormsModule],
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {
  saledetails: SaleDetails = { success: true, message: '', bills: [] };
  totalPaidAmount: number = 0;
  
  itemsPerPage:number=15;
  p:number=1;
  paymentMode: string = 'All';
  noRecords: boolean = false;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchSaleDetails();
  }

  viewReport(): void {
    this.router.navigate(['/sale-details']);
  }

  viewBillDetails(billId: string): void {
    this.router.navigate(['/bill-details'], { queryParams: { bill_id: billId } });
  }

  calculateTotalPaidAmount() {
    if (this.saledetails.bills && this.saledetails.bills.length > 0) {
        this.totalPaidAmount = this.saledetails.bills.reduce((total, bill) => {
            return total + parseFloat(bill.total_amount);
        }, 0);
    } else {
        this.totalPaidAmount = 0;
    }
  }

  filterByDateRange() {
    const fromDateInput = document.getElementById('from-date') as HTMLInputElement;
    const toDateInput = document.getElementById('to-date') as HTMLInputElement;
    const partyNameInput = document.getElementById('party-name') as HTMLInputElement;
    const paymentModeSelect = document.getElementById('payment_mode') as HTMLSelectElement;
  
    const fromDate = fromDateInput ? this.formatDate(fromDateInput.value) : '';
    const toDate = toDateInput ? this.formatDate(toDateInput.value) : '';
    const partyName = partyNameInput ? (partyNameInput.value ? partyNameInput.value.trim() : '') : '';
    const paymentMode = paymentModeSelect ? (paymentModeSelect.value ? paymentModeSelect.value.trim() : '') : '';
  
    console.log('Payment Mode:', this.paymentMode); 
    console.log('From Date:', fromDate); 
    console.log('To Date:', toDate);
  
    let url = `http://localhost/restaurant/get_all_bill_details.php?from_date=${fromDate}&to_date=${toDate}`;
  
    if (partyName !== '') {
      url += `&party_name=${encodeURIComponent(partyName)}`;
    }
  
    // Only append payment_mode if it's not empty
    if (this.paymentMode !== '' && this.paymentMode !== 'All') {
      url += `&payment_mode=${encodeURIComponent(this.paymentMode)}`;
    }
  
    this.http.get<SaleDetails>(url).subscribe(
      (resp: SaleDetails) => {
        if (resp.success) {
          if (resp.bills) {
            this.saledetails.bills = resp.bills;
          } else {
            this.saledetails.bills = [];
            this.noRecords = true;
            this.p = 1; 
          }
          this.noRecords = false;
        } else {
          this.saledetails.bills = [];
          this.noRecords = true;
          this.p = 1; 
        }
        this.calculateTotalPaidAmount();
      },
      error => {
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
  
  fetchSaleDetails() {
    this.http.get<SaleDetails>('http://localhost/restaurant/get_all_bill_details.php').subscribe(
      (resp: SaleDetails) => {
        if (resp.success) {
        this.saledetails = resp;
        this.noRecords = false;
        }
        else
        {
          this.saledetails.bills = [];
          this.noRecords = true;
        }
        this.calculateTotalPaidAmount();
      },
      error => {
        console.error('Error:', error);
      }
    );
  }
}