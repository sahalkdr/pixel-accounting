import { Component, OnInit} from '@angular/core';
import { OnSameUrlNavigation, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/services/user.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { NgxPaginationModule } from 'ngx-pagination';

import { EditPartyDialogComponent } from './edit-party-dialog/edit-party-dialog.component';
import { AddpartyComponent } from './addparty/addparty.component';

import { ConfirmDialogComponent } from '../../layouts/confirm-dialog/confirm-dialog.component';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar'; 




@Component({
  selector: 'app-parties',
  standalone: true,
  imports: [CommonModule,MatIconModule,HttpClientModule,NgxPaginationModule,MatButtonModule,MatInputModule],
  templateUrl: './parties.component.html',
  styleUrl: './parties.component.scss'
})
export class PartiesComponent implements OnInit{
  public parties: any[] = [];
  public filteredParties: any[] = [];
  p:number=1;
  itemsPerPage:number=6;
  totalParty:any;
  
  selectedSection: string = 'parties';
  selectedParty: any = null;
  // parties: any[] = [
  //   { name: 'Party A', phone: '1234567890', email: 'partyA@example.com', address: '123 Main St' },
  //   { name: 'Party B', phone: '0987654321', email: 'partyB@example.com', address: '456 Elm St' }
  // ];
  // transactions: any[] = [
  //   { type: 'Sale', name: 'Item 1', date: '2023-01-01', quantity: 10, price: 100 },
  //   { type: 'Purchase', name: 'Item 2', date: '2023-02-01', quantity: 5, price: 50 }
  // ];


  showSection(section: string) {
    this.selectedSection = section;
    this.selectedParty = null;
  }
  constructor(private router: Router,private userService: UserService,private http: HttpClient,public dialog: MatDialog,private snackBar: MatSnackBar) { }
  ngOnInit(): void {
    // this.checkLoggedIn

    this.fetchparties();
  }

//   async checkLoggedIn(): Promise<void> {
//     console.log('Checking login status...');
//     const id = localStorage.getItem('userId');
//     const token = localStorage.getItem('angular17token');

//     console.log('Token:', token);
//     console.log('User Id:', id);
//     if (!token) {
//         console.log('Token not found, redirecting to login...');
//         this.router.navigate(['/login']);
//         return;
//     }

//     const tokenValid = await this.userService.verifyToken(token);
//     console.log('Token validity:', tokenValid);
//     if (!tokenValid) {
//         console.log('Token invalid, redirecting to login...');
//         this.router.navigate(['/login']);
//     } else {
//         console.log('User logged in.');
//     }
// }


  public fetchparties()
  {
    const userId = localStorage.getItem('userId');

    this.http.get(`http://localhost/restaurant/get-parties.php?user_id=${userId}`).subscribe(
      (resp:any) => {
        console.log(resp);
        this.parties=resp;
        this.filteredParties = resp;
        
      }
    )

  }
  navigateToAddParty() {
    this.router.navigate(['parties/add']);
    
  }

  editParty(party: any) {
    
      this.selectedParty = party;
      
    
  }

  openEditDialog(party: any): void {
    const dialogRef = this.dialog.open(EditPartyDialogComponent, {
      width: '400px',
      data: { party }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Object.assign(this.selectedParty, result);
      }
    });
  }
 

  openAddPartyDialog(): void {
    const dialogRef = this.dialog.open(AddpartyComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        this.parties.push(result.party);
        this.fetchparties();
        this.filteredParties = [...this.parties];
        
      }
      
    });
  }


  filterParties(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredParties = this.parties.filter(party => 
      party.name.toLowerCase().includes(query)
    );
    this.totalParty=this.parties.filter(party => 
      party.name.toLowerCase().includes(query)
    ).length;

  }
  deleteParty(party: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data:{
        
        name:party.name}
    }
  
    );
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      
        this.userService.deleteParty(party.id).then(response => {
          if (response.success) {
            this.fetchparties();
            if (this.selectedParty === party) {
              this.selectedParty = null;
            }
            this.snackBar.open('Item deleted successfully', 'Close', {
              duration: 5000,
          });
          } else {
            this.snackBar.open(response.message, 'Close', {
              duration: 3000,
          });
            console.error('Error deleting party:', response.message);
          }
        });
      }
    });
  }

  showPartyDetails(party: any) {
    this.selectedParty = party;
  }
  

  
}