import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NgxPaginationModule } from 'ngx-pagination';


interface SaleDetails {
  company_info: {
    name: string;
    place: string;
    phone: string;
  };
  bills: {
    bill_id: string;
    customer_name: string;
    subtotal: string;
    total_amount: string;
    payment_mode: string;
    amount_received: string;
    created_at: string;
  }[];
}

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [CommonModule, MatIconModule,NgxPaginationModule],
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {
  saledetails: SaleDetails = { company_info: { name: '', place: '', phone: '' }, bills: [] };
  totalPaidAmount: number = 0;
  p:number=1;
  itemsPerPage:number=16;

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
    this.totalPaidAmount = this.saledetails.bills.reduce((total, bill) => total + parseFloat(bill.total_amount), 0);
  }

  filterByDateRange() {
    const fromDate = (document.getElementById('from-date') as HTMLInputElement).value;
    const toDate = (document.getElementById('to-date') as HTMLInputElement).value;
    const partyName = (document.getElementById('party-name') as HTMLInputElement).value;

    let url = `http://localhost/restaurant/get_all_bill_details.php?from_date=${fromDate}&to_date=${toDate}`;

    if (partyName.trim() !== '') {
      url += `&party_name=${encodeURIComponent(partyName)}`;
    }

    this.http.get<SaleDetails>(url).subscribe(
      (resp: SaleDetails) => {
        console.log(resp);
        this.saledetails = resp;
        this.calculateTotalPaidAmount();
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  fetchSaleDetails() {
    this.http.get<SaleDetails>('http://localhost/restaurant/get_all_bill_details.php').subscribe(
      (resp: SaleDetails) => {
        console.log(resp);
        this.saledetails = resp;
        this.calculateTotalPaidAmount();
      },
      error => {
        console.error('Error:', error);
      }
    );
  }
}
