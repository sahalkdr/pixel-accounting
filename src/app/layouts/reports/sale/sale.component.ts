import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {
  transactions = [
    { date: '2023-01-01', invoiceNo: 'INV001', partyName: 'Party A', transactionType: 'Sale', paymentType: 'Cash', amount: 1000, balanceDue: 0 },
    { date: '2023-01-02', invoiceNo: 'INV002', partyName: 'Party B', transactionType: 'Purchase', paymentType: 'Credit', amount: 2000, balanceDue: 500 }
  ];

  ngOnInit(): void {
    console.log(this.transactions); // Check if transactions are loaded correctly
  }
}
