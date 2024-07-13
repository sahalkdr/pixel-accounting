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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule,DateAdapter } from '@angular/material/core';
import { NativeDateAdapter } from '@angular/material/core';

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
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: DateAdapter, useClass: NativeDateAdapter },  // Explicitly provide DateAdapter
  ]
})
export class AddPaymentOutComponent implements OnInit {

  customerSearchText: string = '';
  parties: Customer[] = [];
  filteredOptionsCustomer: Observable<Customer[]> = new Observable();
  customerControl = new FormControl('');
  noCustomersFound: boolean = false;
  customerDetails: Customer | null = null;

  paymentForm: FormGroup = new FormGroup({
    payment_date: new FormControl('', Validators.required),
    amount: new FormControl('', [Validators.required, Validators.min(0.01)])
  });

  constructor(
    private http: HttpClient,
    @Inject(MatDialogRef) private dialogRef: MatDialogRef<AddPaymentOutComponent>,
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
    const formattedDate = this.paymentForm.get('payment_date')?.value ?
      new Date(this.paymentForm.get('payment_date')?.value).toISOString().split('T')[0] : '';

    const payload = {
      party_id: this.customerDetails ? this.customerDetails.id : null,
      amount: parseFloat(this.paymentForm.get('amount')?.value),
      payment_date: formattedDate,
      user_id: parseInt(localStorage.getItem('userId') || '0', 10)
    };

    this.userService.addPaymentOut(payload).then(response => {
      if (response.success) {
        Swal.fire(`Payment Out saved successfully `);
        console.log('Payment out recorded successfully:', response.message);
      } else {
        console.error('Error recording payment out:', response.message);
      }
    }).catch(error => {
      console.error('Error recording payment out:', error);
    });
  }
}
