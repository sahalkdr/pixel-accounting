import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';


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
  standalone:true,
  imports:[CommonModule,MatIconModule],
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {
  saledetails: SaleDetails = { company_info: { name: '', place: '', phone: '' }, bills: [] };
  billId: number = 0;
  totalPaidAmount: number = 0;

  constructor(private http: HttpClient,private router:Router) { }

  ngOnInit(): void {
    this.fetchSaleDetails();
  }

  viewReport(): void {
    this.router.navigate(['/sale-details']);
  }


  // viewBillDetails(): void {
  //   this.router.navigate(['/bill-details'], { queryParams: { bill_id: this.billId } });
  // }

  viewBillDetails(billId: string): void {
    this.router.navigate(['/bill-details'], { queryParams: { bill_id: billId } });
}
calculateTotalPaidAmount() {
  this.totalPaidAmount = this.saledetails.bills.reduce((total, bill) => total + parseFloat(bill.total_amount), 0);
}

filterByDateRange() {
  const fromDate = (<HTMLInputElement>document.getElementById('from-date')).value;
  const toDate = (<HTMLInputElement>document.getElementById('to-date')).value;
  const partyName = (<HTMLInputElement>document.getElementById('party-name')).value;

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
