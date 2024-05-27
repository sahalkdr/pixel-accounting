import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/services/user.service';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-parties',
  standalone: true,
  imports: [CommonModule,MatIconModule],
  templateUrl: './parties.component.html',
  styleUrl: './parties.component.scss'
})
export class PartiesComponent{
  selectedSection: string = 'parties';
  selectedParty: any = null;
  parties: any[] = [
    { name: 'Party A', phone: '1234567890', email: 'partyA@example.com', address: '123 Main St' },
    { name: 'Party B', phone: '0987654321', email: 'partyB@example.com', address: '456 Elm St' }
  ];
  transactions: any[] = [
    { type: 'Sale', name: 'Item 1', date: '2023-01-01', quantity: 10, price: 100 },
    { type: 'Purchase', name: 'Item 2', date: '2023-02-01', quantity: 5, price: 50 }
  ];

  showSection(section: string) {
    this.selectedSection = section;
    this.selectedParty = null;
  }
  constructor(private router: Router,private userService: UserService) { }
  navigateToAddParty() {
    this.router.navigate(['parties/add']);
    // Logic to navigate to add party page
  }

  editParty(party: any) {
    // Logic to edit party
  }

  deleteParty(party: any) {
    // Logic to delete party
  }

  showPartyDetails(party: any) {
    this.selectedParty = party;
  }
  // fetchParties() {
  //   this.userService.fetchParties().subscribe(
  //     data => this.parties = data,
  //     error => console.error('Error fetching parties', error)
  //   );
  // }

  adjustParty(party: any) {
    // Logic to adjust party details
  }
}