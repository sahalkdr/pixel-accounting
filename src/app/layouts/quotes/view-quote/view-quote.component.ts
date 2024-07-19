import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { UserService } from '../../../shared/services/user.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-view-quote',
  imports: [CurrencyPipe, CommonModule,HttpClientModule],
  standalone: true,
  templateUrl: './view-quote.component.html',
  styleUrls: ['./view-quote.component.scss']
})
export class ViewQuoteComponent implements OnInit {
  

  
  
  company_name: string | null = null;
  location: string | null = null;
  phone: string | null = null;
  quoteDetails: { quote: any, items: any[],bill_items:any[],bill_details:any } = { quote: {}, items: [],bill_items:[],bill_details:{} };

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

    const quoteId = this.route.snapshot.queryParamMap.get('quote_id');
    console.log('Quote ID from route:', quoteId);
    if (quoteId) {
      this.fetchQuoteDetails(quoteId);
    }
  }

  print(){
      window.print();
    
  }

  

  

  

  fetchQuoteDetails(quoteId: string | null): void {
    if (quoteId) {
      const url = `http://localhost/restaurant/get_quote_details.php?quote_id=${quoteId}`;
      console.log('Fetching quote details from URL:', url);

      this.http.get<{ success: boolean, data: any }>(url)
        .subscribe({
          next: (data: any) => {
            if (data.success) {
              console.log("data",data);
              console.log('Fetched quote details:', data);
              this.quoteDetails = data;
            } else {
              console.error('Error fetching quote details:', data.response.message);
            }
          },
          error: (err) => {
            console.error('Error fetching quote details:', err);
            this.quoteDetails = { quote: {}, items: [],bill_items:[],bill_details:{} };
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
