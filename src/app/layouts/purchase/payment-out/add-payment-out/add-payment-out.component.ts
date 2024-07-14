import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../../../shared/services/user.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AddpartyComponent } from '../../../parties/addparty/addparty.component';

import { HttpClientModule } from '@angular/common/http';

interface Customer {
  id: number;
  name: string;
  phone: number;
}

@Component({
  selector: 'app-add-payment-out',
  standalone: true,
  templateUrl: './add-payment-out.component.html',
  styleUrls: ['./add-payment-out.component.scss'],
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    HttpClientModule,
    
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
   
  ]
})
export class AddPaymentOutComponent implements OnInit {

  customerSearchText: string = '';
  parties: Customer[] = [];
  public suggestedCustomers: Customer[] = [];
  filteredParties: Customer[] = [];

  filteredOptionsCustomer: Observable<Customer[]> = new Observable();
  customerControl = new FormControl('');
  noCustomersFound: boolean = false;
  customerDetails: Customer | null = null;

  paymentForm: FormGroup = new FormGroup({
    amount: new FormControl('', [Validators.required, Validators.min(0.01)])
  });

  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<AddPaymentOutComponent>,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchParties();

    this.filteredOptionsCustomer = this.customerControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCustomer(value || ''))
    );
  }

  private _filterCustomer(value: string): Customer[] {
    const filterValue = value.toLowerCase();
    return this.parties.filter(party =>
      party.name.toLowerCase().includes(filterValue)
    );
  }
  openAddPartyDialog(): void {
    const dialogRef = this.dialog.open(AddpartyComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        this.parties.push(result.party);
        this.fetchParties();
        this.customerDetails = { id: result.party.id, name: result.party.name, phone: result.party.phone }; // Auto-select new party

        this.filteredParties = [...this.parties];
        this.customerControl.setValue(result.party.name);

        
      }
      
    });
  }

  fetchParties(): void {
    const userId = localStorage.getItem('userId');
    this.http.get<Customer[]>(`http://localhost/restaurant/get-parties.php?user_id=${userId}`).subscribe(
      (resp: Customer[]) => {
        this.parties = resp;
        console.log('Fetched parties:', this.parties);
      },
      (error) => {
        console.error('Error fetching parties:', error);
      }
    );
  }
  
  selectCustomer(name: string): void {
    this.customerSearchText = '';
    this.noCustomersFound = false;
    const customer = this.parties.find(p => p.name === name);
    if (customer) {
      this.customerDetails = {
        id: customer.id,
        name: customer.name,
        phone: customer.phone
      };
    }
    this.customerControl.setValue(name);
    console.log('Selected customer:', this.customerDetails);
  }


  savePaymentout(): void {
    console.log('Before saving payment out:', this.customerDetails, this.paymentForm.value);

    const payload = {
      party_id: this.customerDetails ? this.customerDetails.id : null,
      amount: parseFloat(this.paymentForm.get('amount')?.value),
      user_id: parseInt(localStorage.getItem('userId') || '0', 10)
    };
    console.log('Sending payload:', payload);

    this.userService.addPaymentOut(payload).then(response => {
      if (response.success) {
        Swal.fire(`Payment Out saved successfully `);
        console.log('Payment out recorded successfully:', response.message);
        this.dialogRef.close(); // Ensure dialogRef is accessible here

      } else {
        console.error('Error recording payment out:', response.message);
      }
    }).catch(error => {
      console.error('Error recording payment out:', error);
    });
  }
}
