import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { UserService } from '../../../shared/services/user.service';


@Component({
  selector: 'app-view-bill',
  imports: [CurrencyPipe, CommonModule],
  standalone: true,
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {
  company_name: string | null = null;
  location: string | null = null;
  phone: string | null = null;
  billDetails: { bill: any, items: any[] } = { bill: {}, items: [] };

  constructor(
    private http: HttpClient,private userService: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const storedCompanyName = localStorage.getItem('companyName');
    this.location = localStorage.getItem('location');
    this.phone = localStorage.getItem('phone');
    if (storedCompanyName) {
      this.company_name = storedCompanyName;
    } else {
      const userDetails = this.userService.getUserDetails();
      if (userDetails) {
        this.company_name = userDetails.company_name;
      }
    }

    const billId = this.route.snapshot.queryParamMap.get('bill_id');
    console.log('Bill ID from route:', billId); 
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
      console.log('Fetching bill details from URL:', url);

      this.http.get<{ success: boolean, data: any }>(url)
        .subscribe({
          next: (data: any) => {
            if (data.success) {
              console.log('Fetched bill details:', data.data); 
              this.billDetails = data.data;
            } else {
              console.error('Error fetching bill details:', data.message); 
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
