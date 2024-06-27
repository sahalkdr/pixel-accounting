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
    private http: HttpClient,
    private userService: UserService,
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

  printBill(size: string) {
    const printContents = document.querySelector('.bill-container')?.innerHTML;
    const printWindow = window.open('', '_blank');
  
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <style>
              @page {
                size: ${size === '53mm' ? '53mm' : 'A4'};
                margin: 2px 2px;
              }
              body {
                margin: 3px;
                font-family: Arial, sans-serif;
                font-size: 10px;
              }
              .bill-container {
                width: ${size === '53mm' ? '53mm' : '210mm'};
                margin: auto;
                
                padding: ${size === '53mm' ? '5px' : '20px'};
                font-size: ${size === '53mm' ? '4px' : '16px'};
              }
              .header {
                display: flex;
                justify-content: space-between;
                // align-items: flex-start;
                font-size: ${size === '53mm' ? '4px' : '16px'};
              }
              .company-details h5 {
                font-size: ${size === '53mm' ? '4px' : '16px'};
                margin: 0;
              }
              .company-details h6 {
                font-size: ${size === '53mm' ? '4px' : '16px'};
                margin: 0;
              }
              .items-table {
                width: 100%;
                
                border-collapse: collapse;
                margin: 0 auto;
                border: none;
              }
              .items-table th, .items-table td {
                padding: ${size === '53mm' ? '2px' : '8px'};
                font-size: ${size === '53mm' ? '4px' : '16px'};
                text-align: center;
                border: none;
              }
              
              .footer {
                font-size: ${size === '53mm' ? '4px' : '16px'};
              }
              .footer .bill-info-row {
                display: flex;
                justify-content: space-between;
                // margin-bottom: 10px;
              }
              
              .value {
                text-align: right;
              }
              .print-button {
                display: none;
              }
            </style>
          </head>
          <body>${printContents}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
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

  calculateTotal(item: any): number {
    const taxableAmount = parseFloat(item.taxable_amount);
    const taxRate = parseFloat(item.tax_rate);
    const taxAmount = (taxRate / 100) * taxableAmount;
    return taxableAmount + taxAmount;
  }
}
