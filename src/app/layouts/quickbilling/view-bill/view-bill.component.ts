import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-bill',
  imports: [CurrencyPipe, CommonModule],
  standalone: true,
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {
  billDetails: { bill: any, items: any[] } = { bill: {}, items: [] };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const billId = this.route.snapshot.queryParamMap.get('bill_id');
    console.log('Bill ID from route:', billId); // Debugging line
    if (billId) {
      this.fetchBillDetails(billId);
    }
  }

  printBill(): void {
    window.print();
  }

  fetchBillDetails(billId: string | null): void {
    if (billId) {
      const url = `http://localhost/restaurant/get_bill_details.php?bill_id=${billId}`;
      console.log('Fetching bill details from URL:', url); // Debugging line

      this.http.get<{ success: boolean, data: any }>(url)
        .subscribe({
          next: (data: any) => {
            if (data.success) {
              console.log('Fetched bill details:', data.data); // Debugging line
              this.billDetails = data.data;
            } else {
              console.error('Error fetching bill details:', data.message); // Debugging line
            }
          },
          error: (err) => {
            console.error('Error fetching bill details:', err);
            this.billDetails = { bill: {}, items: [] };
          }
        });
    }
  }
}
