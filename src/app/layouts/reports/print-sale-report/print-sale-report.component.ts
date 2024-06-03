import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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
  selector: 'app-print-sale-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './print-sale-report.component.html',
  styleUrls: ['./print-sale-report.component.scss']
})
export class PrintSaleReportComponent implements OnInit {
  saledetails: SaleDetails = { company_info: { name: '', place: '', phone: '' }, bills: [] };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchSaleDetails();
  }

  printBill(): void {
    window.print();
  }

  fetchSaleDetails() {
    this.http.get<SaleDetails>('http://localhost/restaurant/get_all_bill_details.php').subscribe(
      (resp: SaleDetails) => {
        console.log(resp);
        this.saledetails = resp;
      },
      error => {
        console.error('Error:', error);
      }
    );
  }
}
