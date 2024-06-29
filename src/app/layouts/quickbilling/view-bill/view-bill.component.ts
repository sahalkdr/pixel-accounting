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
      let pageSize, bodyWidth, fontSize, padding, margin,marginb, elementWidth, rightPadding;

      if (size === '53mm') {
        pageSize = '53mm';
        bodyWidth = '53mm';
        fontSize = '4px';
        padding = '2px';
        margin = '10px';
        marginb='3px';
        rightPadding = '12px';
        elementWidth = '100%';
      } else {
        pageSize = 'A4';
        bodyWidth = '210mm';
        fontSize = '20px';
        padding = '50px';
        margin = '50px';
        rightPadding = '50px'; 
        elementWidth = '100%';
      }

      printWindow.document.write(`
        <html>
          <head>
            <style>
              @page {
                size: ${pageSize};
                margin: 0;
              }
              body {
                width: ${bodyWidth};
                margin: ${margin};
                padding: 0;
                font-size: ${fontSize};
              }
              .bill-container {
                width: ${bodyWidth};
                margin: ${margin};
                
                padding: ${padding};
                font-size: ${fontSize};
                padding-right: ${rightPadding};
                background: #fff;
                border-radius: 8px;
              }
              .bill-header {
                width: calc(${elementWidth} - ${rightPadding});
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid #948fe3;
                padding-right: ${rightPadding};
                padding-bottom: ${size === '53mm' ? '2px' : '10px'};
                margin-bottom: ${size === '53mm' ? '5px' : '20px'};
                font-size: ${fontSize};
              }
              .company-details h1 {
                margin: 0;
                
                font-size: ${size === '53mm' ? '10px' : '50px'};
              }
              .company-details p {
                 margin: 0; 
              }
              .bill-details {
                display: flex;
                justify-content: space-between;
                margin-bottom: ${size === '53mm' ? '5px' : '20px'};
                width: ${elementWidth};
                padding-right: ${rightPadding};
              }
              .bill-details div p {
                margin: 0;
              }
              .bill-details div strong {
                margin-bottom: ${size === '53mm' ? '3px' : '10px'};
                display: block;
              }
              .bill-info {
                text-align: right;
              }
              .bill-table {
                width: ${elementWidth};
                border-collapse: collapse;
                margin-bottom: ${size === '53mm' ? '2px' : '2px'};
                border-bottom: 1px solid #948fe3;
                padding-right: ${rightPadding};
              }
              .bill-table th, .bill-table td {
                padding: ${size === '53mm' ? '2px' : '10px'};
                text-align: left;
                font-size: ${fontSize};
              }
              .bill-table th {
                background: #948fe3;
                color: #fff;
              }
              .bill-totals {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                margin-top: ${size === '53mm' ? '2px' : '2px'};
                width: ${elementWidth};
              }
              .totals-container {
                width: ${size === '53mm' ? '50%' : '50%'};
                background: #fff;
                padding: ${padding};
                border-radius: 8px;
              }
              .total-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: ${size === '53mm' ? '2px' : '5px'};
              }
              .total-row.total {
                font-weight: bold;
                border-radius: 4px;
              }
              .label {
                margin-right: ${size === '53mm' ? '2px' : '10px'};
              }
              .value {
                margin-left: auto;
              }
              @media print {
                button {
                  display: none;
                }
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
