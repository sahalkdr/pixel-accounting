import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogContentComponent } from '../sale/dialog-content/dialog-content.component';

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
import { formatDate } from '@angular/common';

interface PurchaseDetails {
  success: boolean;
  message: string;
  company_info?: {
    name: string;
    place: string;
    phone: string;
  };
  purchase?: Purchase[];
}

interface Purchase {
  purchase_id: string;
  customer_name: string;
  total_tax: string;
  total_amount: string;
  
  created_at: string;
}

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [ CommonModule,
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
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.scss'
})
export class PurchaseReportComponent implements OnInit{
  purchasedetails: PurchaseDetails = { success: true, message: '', purchase: [] };
  totalPaidAmount: number = 0;
  totalPaidTax: number = 0;

  itemsPerPage: number = 13;
  p: number = 1;
  
  noRecords: boolean = false;

  fromDate: string = '';
  toDate: string = '';
  printablePurchase: Purchase[] = []; // Store all bills for printing
  selectedPurchase: any; // Add this line

  constructor(private http: HttpClient, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchPurchaseDetails();
  }

  openDialog(purchase: any): void {
    this.dialog.open(DialogContentComponent, {
      data: { purchase: purchase },
    });
  }

  // viewReport(): void {
  //   this.router.navigate(['/sale-details']);
  // }

  viewPurchaseDetails(PurchaseId: string): void {
    this.router.navigate(['/bill-details'], { queryParams: { purchase_id: PurchaseId } });
  }
  editbill(purchaseId: string): void {
    console.log('Navigating to quickbilling with purchase_id:', purchaseId);  // Debugging line
    this.router.navigate(['/dashboard/purchase'], { queryParams: { purchase_id: purchaseId } });
}


  calculateTotalPaidAmount() {
    if (this.purchasedetails.purchase && this.purchasedetails.purchase.length > 0) {
      this.totalPaidAmount = this.purchasedetails.purchase.reduce((total, purchase) => {
        return total + parseFloat(purchase.total_amount);
      }, 0);
    } else {
      this.totalPaidAmount = 0;
    }
  }

  calculateTotalPaidTax() {
    if (this.purchasedetails.purchase && this.purchasedetails.purchase.length > 0) {
      this.totalPaidTax = this.purchasedetails.purchase.reduce((total, purchase) => {
        return total + parseFloat(purchase.total_tax);
      }, 0);
    } else {
      this.totalPaidTax = 0;
    }
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

    let url = `http://localhost/restaurant/get_all_purchase_details.php?from_date=${fromDate}&to_date=${toDate}&user_id=${userId}`;

    if (partyName !== '') {
      url += `&party_name=${encodeURIComponent(partyName)}`;
    }

  
    

    this.http.get<PurchaseDetails>(url).subscribe(
      (resp: PurchaseDetails) => {
        if (resp.success) {
          if (resp.purchase) {
            this.purchasedetails.purchase = resp.purchase;
            this.printablePurchase = resp.purchase; // Store all bills for printing
          } else {
            this.purchasedetails.purchase = [];
            this.printablePurchase = [];

            this.noRecords = true;
            this.p = 1;
          }
          this.noRecords = false;
        } else {
          this.purchasedetails.purchase = [];
          this.printablePurchase = [];

          this.noRecords = true;
          this.p = 1;
        }
        this.calculateTotalPaidAmount();
        this.calculateTotalPaidTax();
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

  navigate(purchaseId: string) {
    this.router.navigate(['/bill-details'], { queryParams: { purchase_id: purchaseId } });
  }




  fetchPurchaseDetails() {
    const userId = localStorage.getItem('userId');

    this.http.get<PurchaseDetails>(`http://localhost/restaurant/get_all_purchase_details.php?user_id=${userId}`).subscribe(
      (resp: PurchaseDetails) => {
        if (resp.success) {
          this.purchasedetails = resp;
          this.printablePurchase = resp.purchase ? resp.purchase : [];

          this.noRecords = false;
        } else {
          this.purchasedetails.purchase = [];
          this.printablePurchase = [];

          this.noRecords = true;
        }
        this.calculateTotalPaidAmount();
        this.calculateTotalPaidTax();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

}
